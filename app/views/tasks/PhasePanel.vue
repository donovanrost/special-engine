<template>
  <FlexboxLayout class="panel" flexDirection="column">
    <FlexboxLayout class="panel-header" @tap="onHeaderTap()">
      <Label :text="phase" />
    </FlexboxLayout>
    <FlexboxLayout class="item panel-body" v-show="showBody">
      <ScrollView>
          <RadListView ref="listView" for="item in itemList" class="list"
            @itemTap="onItemTap"
            swipeActions="true"
            @itemSwipeProgressChanged="onItemSwipeChanged"
            @itemSwipeProgressStarted="onSwipeStarted">

            <v-template>
                <PhasePanelItem :item="item">

                </PhasePanelItem>
                <!-- <FlexboxLayout class="item list-item" flexDirection="column">
                    <Label class="big list-item-title" :text="item.title"/>>
                    <Label class="list-item-description" :text="item.description"/>
                    <StackLayout class="list-item-separator" height="2"/>
                </FlexboxLayout> -->

            </v-template>

            <v-template name="itemswipe">
            <GridLayout columns="auto, *, auto" backgroundColor="White">
                <StackLayout id="delete-view" col="0" class="swipe-item left"
                    orientation="horizontal" @tap="onDelete">
                <Label text="Delete" verticalAlignment="center"
                    color="white"
                    horizontalAlignment="center"/>
                </StackLayout>
                <StackLayout id="advance-view" col="2" 
                    class="swipe-item right"
                    orientation="horizontal" @tap="onRightSwipeClick">
                <Label text="Advance" verticalAlignment="center" 
                    color="white"
                horizontalAlignment="center" />
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
import PhasePanelItem from './PhasePanelItem'

import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    components: {
        "PhasePanelItem": PhasePanelItem
    },
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

          

      }
    },
    methods: {
        ...mapActions([
            'fetchUserData'
        ]),
        onItemTap({item}) {
            console.log(item.title)
            item.data().expanded = !item.data().expanded
        },
        onHeaderTap() {
        this.showBody = !this.showBody
      },
      /* RadListView functions */
        onSwipeStarted ({ data, object }) {
            console.log(`Swipe started`);
            const swipeLimits = data.swipeLimits;
            const swipeView = object;
            const leftItem = swipeView.getViewById('delete-view');
            const rightItem = swipeView.getViewById('advance-view');
            swipeLimits.left = leftItem.getMeasuredWidth();
            swipeLimits.right = rightItem.getMeasuredWidth();
            swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
        },
        onDelete ({ object }) {
            const itemIndex = this.itemList.indexOf(object.bindingContext)
            const item = this.itemList[itemIndex]
    
            console.log("FROM ON DELETE: ", item)
            firebase.firestore.collection('tasks').doc(item.id).delete()

            this.itemList.splice(itemIndex, 1);


            this.$refs.listView.notifySwipeToExecuteFinished();
        },
        onRightSwipeClick ({ object }) {
            const itemIndex = this.itemList.indexOf(object.bindingContext)
            const item = this.itemList[itemIndex]
            const currentPhaseIndex = this.getCurrentBoard.data().phases.indexOf(item.data().phase)

            firebase.firestore.collection('tasks').doc(item.id).update({
                phase: this.getCurrentBoard.data().phases[currentPhaseIndex + 1]
            })

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
                        //pass the doc so you can have the ID
                        this.itemList.push(change.doc)
                    }
                    if (change.type === 'modified') {
                        console.log("FROM FETCHTASKS CHANGE TYPE IS MODIFIED")
                        console.log(change.doc.data())
                    }
                    if (change.type === 'removed') {
                        console.log("FROM FETCHTASKS CHANGE TYPE IS REMOVED")
                        console.log(change.doc.data())
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
.list {
}
.list-item {
    margin-left: 5;
    margin-right: 5
}
.list-item-title {
    font-size: 24;
    
}
.list-item-description {
    font-size: 18;
}
.list-item-separator {
    background-color: lightslategray;
    /* margin-top: 5;
    margin-bottom: 5; */
}
#delete-view {
    background-color: #D51A1A;
}
#advance-view {
    background-color:#1ad51a ;
    
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
.panel {
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
