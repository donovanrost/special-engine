<template>
  <FlexboxLayout class="panel" flexDirection="column">
    <FlexboxLayout class="panel-header" @tap="onHeaderTap()">
      <Label :text="phase" />
    </FlexboxLayout>
    <FlexboxLayout class="item panel-body" v-show="showBody">
      <ScrollView>
          <RadListView ref="listView" for="item in itemList"
            swipeActions="true"
            @itemSwipeProgressChanged="onItemSwipeChanged"
            @itemSwipeProgressStarted="onSwipeStarted">

            <v-template>
                <StackLayout class="item" orientation="vertical">
                    <Label class="big" :text="item.title"></Label>
                    <Label v-if="item.description" :text="item.description"></Label>
                </StackLayout>
            </v-template>

            <v-template name="itemswipe">
            <GridLayout columns="auto, *, auto" backgroundColor="White">
                <StackLayout id="mark-view" col="0" class="swipe-item left padded"
                    orientation="horizontal" @tap="onLeftSwipeClick">
                <Label text="mark" verticalAlignment="center" horizontalAlignment="center"/>
                </StackLayout>
                <StackLayout id="delete-view" col="2" 
                    :class="classObject"
                    orientation="horizontal" @tap="onRightSwipeClick">
                <Label text="delete" verticalAlignment="center" horizontalAlignment="center" />
                </StackLayout>
            </GridLayout>
            </v-template>
          
          </RadListView>
          
      </ScrollView>
    </FlexboxLayout>

  </FlexboxLayout>


</template>

<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    props:{
        phase: {
            type: String,
            required: true
        }
    },  
    data() {
      return {
          showBody: true,
          itemList: [
            
          ],
          selected: false,
          activeClass: 'selected',
          

      }
    },
    methods: {
        ...mapActions([
            'fetchUserData'
        ]),
        ...mapMutations([
        
        ]),
        onHeaderTap() {
        this.showBody = !this.showBody
      },
      /* RadListView functions */
        onSwipeStarted ({ data, object }) {
            console.log(`Swipe started`);
            const swipeLimits = data.swipeLimits;
            const swipeView = object;
            const leftItem = swipeView.getViewById('mark-view');
            const rightItem = swipeView.getViewById('delete-view');
            swipeLimits.left = leftItem.getMeasuredWidth();
            swipeLimits.right = rightItem.getMeasuredWidth();
            swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
        },
        onLeftSwipeClick (event) {
            console.log('left action tapped');
            this.$refs.listView.notifySwipeToExecuteFinished();
        },
        onRightSwipeClick ({ object }) {
            console.log('right action tapped');
            // remove item
            this.itemList.splice(this.itemList.indexOf(object.bindingContext), 1);
            this.$refs.listView.notifySwipeToExecuteFinished();
        },
        onItemSwipeChanged ({data}) {
            console.log(data)
            if(data.x < -50) {
                console.log('CHANGING selected')
                this.selected=true
            }
            console.log(this.selected)
        },
        fetchTasks(){
            firebase.firestore.collection('tasks')
            .where('boardID', '==', this.getCurrentBoard.id)
            .where('phase', '==', this.phase)
            .onSnapshot( (snapshot) => {
                snapshot.docChanges().forEach((change) =>{
                    if (change.type === 'added') {
                        this.itemList.push(change.doc.data())
                    }
                })
            })
          
        }
        
    },
    computed: {
        ...mapGetters([
            'getUserData',
            'getCurrentBoard'
        ]),
        classObject: function() {
            return ['right', 'swipe-item', this.selected ? this.activeClass : 'notSelected' ]
        }
    },
    mounted() {
        this.fetchTasks()
    }
  }
</script>

<style scoped>
#mark-view{
    background-color:blue;
}
/* #delete-view{
    background-color:red;
} */
.selected{
    background-color: green;
}
.notSelected {
    background-color: yellow;
}
.panel{
  /* height: 300; */
  background-color: lightblue;
  border-radius:10;
  border-color: blue;
  border-width: 2;
  margin-bottom: 15;
}
.panel-header{
  height: 50;
  background-color: blue; 
  align-items: center;
  justify-content: center;
  opacity: .8;
}
.panel-body{
  height:300;
  background-color: lightblue;
  /* margin: 10; */
}
.panel-body-item {
  height: 50;
  color:red;
  /* margin-bottom: 10; */
  border-bottom-width: 2;
  border-bottom-color: lightpink;
}
.padded {
    padding: 10;
}

</style>
