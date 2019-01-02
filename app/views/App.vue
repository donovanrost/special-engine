<template>
    <Page class="page" >
            <ActionBar title="Task Board" backgroundColor="#2d2d2d" color="#0083FF">
                <ActionItem @tap="onTapAdd"
                    ios.systemIcon="4" ios.position="right"
                    color="#0083FF"
                />


            </ActionBar>
        <ScrollView class="home-panel">
            <StackLayout v-if="getCurrentBoard">
                <PhasePanel v-for="phase in getCurrentBoard.data().phases" :key="phase"
                    :phase="phase"
                ></PhasePanel>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import { mapGetters, mapActions, mapMutations } from 'vuex'
import PhasePanel from './tasks/PhasePanel'
import AddTaskModal from './tasks/AddTaskModal'
export default {
    components: {
        'PhasePanel': PhasePanel,
    },  
    data() {
      return {
        msg: 'Hello World!',

      }
    },
    methods: {
        ...mapActions([
            'fetchUserData',
            'fetchTemplates'
        ]),
        ...mapMutations([
            'setCurrentBoard'
        ]),
        fetchBoardData(boardID) {
            console.log('FROM fetchBoardData: ', 1)

            firebase.firestore.collection('boards').doc(boardID).get()
            .then(doc => {            
                console.log('FROM fetchBoardData: ', 2)
                if (doc.exists) {
                    console.log('FROM fetchBoardData: ', doc.data())
                    this.setCurrentBoard(doc)
                }
            })
            .catch(err => {
                console.log('FROM fetchBoardData: ', 3)
            })
        },
        onTapAdd() {
            this.$showModal(AddTaskModal)
        },
    },
    computed: {
        ...mapGetters([
            'getUserData',
            'getCurrentBoard',
            'getTemplates'
        ])
    },

    mounted() { 
        console.log(1, "FROM mounted HOOK")
        this.fetchUserData()
        .then(() => {
            console.log(2, "FROM mounted HOOK")
            console.log( "FROM mounted HOOK", this.getUserData.boards[0])
            this.fetchBoardData(this.getUserData.boards[0])
            console.log(43, this.getTemplates)
            this.fetchTemplates(this.getUserData.boards[0])
        })
    }
  }
</script>

<style scoped>
ActionBar {
    background-color: #53ba82;
    color: #ffffff;
}

.message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
}
.home-panel {
    /* vertical-align: center; */
    font-size: 20;
    margin: 15;
}
</style>
