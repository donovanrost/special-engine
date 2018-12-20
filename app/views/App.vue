<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <GridLayout  columns="*" rows="*">
            <StackLayout v-if="!getCurrentBoard" >
                <Label text="Data not loaded" row="0"></Label>
            </StackLayout>
            <StackLayout v-else>
                <Label :text="getCurrentBoard.owner" row="0"></Label>
                <Label :text="getCurrentBoard.phases" row="1"></Label>
                <StackLayout v-for="phase in getCurrentBoard.phases" :key="phase">
                    <Label :text="phase"></Label>
                </StackLayout>
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        msg: 'Hello World!',
        //boardData: null

      }
    },
    methods: {
        ...mapActions([
            'fetchUserData'
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
                    //this.boardData = doc.data()
                    this.setCurrentBoard(doc.data())
                }
            })
            .catch(err => {
                console.log('FROM fetchBoardData: ', 3)

            })
        }
    },
    computed: {
        ...mapGetters([
            'getUserData',
            'getCurrentBoard'
        ])
    },
    created() {
        console.log(1, "FROM CREATED HOOK")
        this.fetchUserData()
        .then(() => {
            console.log(2, "FROM CREATED HOOK")
            setTimeout(() => {
                console.log( "FROM CREATED HOOK", this.getUserData.boards[0])
                this.fetchBoardData(this.getUserData.boards[0])
            }, 500)

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
</style>
