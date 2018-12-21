<template>
	<StackLayout class="p-20" backgroundColor="white">
        <ActivityIndicator :busy="busy"/>
        <TextField v-model="taskTitle" hint="Enter a new task" />
        <TextField v-model="taskDescription" hint="Task Description" />
        <DropDown :items="getCurrentBoard.data().phases" 
            hint="backlog"
            :selectedIndex="initialPhaseIndex"
            @selectedIndexChanged="onChanged($event)"

            row="0" colSpan="2"
        ></DropDown>

        <Button text="Add Task" @tap="onButtonTap" />

	</StackLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
export default {
    data() {
        return {
            taskTitle: null,
            taskDescription: '',
            initialPhaseIndex: 2,
            busy: false,
        }
    },
    computed: {
        ...mapGetters([
            'getCurrentBoard',
            'getUserData'
        ])
    },
    methods: {
        setBusy(bool){
            this.busy = bool
        },
        onButtonTap() {
            console.log("FROM BUTTON TAP")
            console.log(this.taskTitle)
            console.log(this.taskDescription)
            console.log(this.initialPhaseIndex)

            if(!this.taskTitle || this.taskTitle.length === 0) {
                alert('Your new task needs a title')
                .then(() => {
                    console.log("Alert dialog closed.");
                });
                return;
            }
            this.setBusy(true)
            firebase.firestore.collection('tasks').add({
                owner: this.getUserData.uid,
                //I need to get the board id
                boardID: this.getCurrentBoard.id,
                phase: this.getCurrentBoard.data().phases[this.initialPhaseIndex],
                title: this.taskTitle,
                description: this.taskDescription
            })
            .then(() => {
                this.setBusy(false)
                this.$modal.close()
            })

        },
        onChanged(e){
            this.initialPhaseIndex = e.newIndex
        }
    }
};
</script>

<style>
</style>
