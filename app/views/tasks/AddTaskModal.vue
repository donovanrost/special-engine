<template>
    <FlexboxLayout backgroundColor="white" flexDirection="column">
        <GridLayout rows="auto" columns="75,*,75" class="action-bar p-10">
            <Button text="Close" class="text-left action-item" row="0" col="0" 
                @tap="$modal.close()"/>
            <Label text="My Modal" class="text-center action-bar-title" row="0" col="1" />
        </GridLayout>

	<StackLayout class="task-form" >
        <ActivityIndicator :busy="busy"/>
        <GridLayout rows="auto, auto, auto">
            <StackLayout class="input-field" row="0">
                <TextField v-model="taskTitle" hint="Enter a new task" />
            </StackLayout>

            <StackLayout class="input-field" row="1">
                <TextField v-model="taskDescription" hint="Task Description" />
            </StackLayout>

            <StackLayout class="input-field" row="2">
                <DropDown :items="getCurrentBoard.data().phases" 
                    hint="backlog"
                    ``:selectedIndex="initialPhaseIndex"
                    @selectedIndexChanged="onChanged($event)"

                    row="0" colSpan="2"
                ></DropDown>
            </StackLayout>

        </GridLayout>
        <Button class="btn-primary" text="Add Task" @tap="onButtonTap"/>

	</StackLayout>
    </FlexboxLayout>
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
                description: this.taskDescription,
                expanded: false,
            })
            .then(() => {
                this.setBusy(false)
                this.$modal.close()
            })

        },
        onChanged(e){
            this.initialPhaseIndex = e.newIndex
            console.log(e.newIndex, this.initialPhaseIndex)
        }
    }
};
</script>

<style>
.task-form{
    margin-top:30;
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
}
.input-field2{
    margin-bottom:25;
    border-radius:5;
}

</style>
