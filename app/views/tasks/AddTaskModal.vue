<template>
    <FlexboxLayout class="page" flexDirection="column">
        <GridLayout rows="auto" columns="75,*,75" class="action-bar p-10">
            <Button text="Close" class="text-left action-item" row="0" col="0" 
                @tap="$modal.close()"/>
            <Label class="text-center action-bar-title" 
                :text="(selectedModalChoice === 0) ? 'New Task' : 'New Template' "  
                row="0" col="1" />
            <Button text="Done" class="text-right action-item" row="0" col="2" 
                @tap="onDone"/>
        </GridLayout>
        <ScrollView>
            <ActivityIndicator color="white"  :busy="busy"/>

            <GridLayout rows="auto ,auto, auto, auto, auto, auto, auto" class="task-form">
                <StackLayout row="0" class="input-field2">
                    <SegmentedBar v-model="selectedModalChoice" @selectedIndexChange="onSelectedIndexChange">
                        <SegmentedBarItem :title="modalChoices[0]"/>
                        <SegmentedBarItem :title="modalChoices[1]"/>
                    </SegmentedBar>
                </StackLayout>

                <StackLayout row="1" class="input-field2">
                    <!-- 0 for new task -->
                    <!-- 1 for new template -->
                    <DropDown v-if="selectedModalChoice === 0" 
                        placeholder="No Template Selected"
                        :items="getTemplateNames"  
                        class="input field2"
                        hint="no template selected"
                        v-model="selectedTemplateIndex"
                        @selectedIndexChanged="onSelectedTemplateChanged($event)"

                    /> 
                    <TextField v-if="selectedModalChoice === 1" 
                        hint="Template Name"
                        v-model="template.name"
                        class="input field2" 
                    />
                </StackLayout>



                <StackLayout row="2" class="input-field2">
                    <TextField v-model="task.title" 
                        hint="task name"  
                        class="input input-border field2"
                    />
                </StackLayout>

                <StackLayout row="3" class="input-field2">
                    <TextView v-model="task.description"
                        hint="task description"  
                        class="input field2" 
                        height="200"/>
                </StackLayout>

                <StackLayout row="4" class="input-field2">
                    <GridLayout rows="auto, auto, *" columns="auto, *">
                        <DropDown :items="getCurrentBoard.data().phases" 
                            hint="backlog" 
                            class="input field2"
                            :selectedIndex="initialPhaseIndex"
                            @selectedIndexChanged="onChanged($event)"
                            row="0" colSpan="2"

                        ></DropDown>
                    </GridLayout>
                </StackLayout>

                <FlexboxLayout row="5" class="input-field2" justifyContent="space-between" verticalAlign="center">
                    <FlexboxLayout v-for="(color, index) in colors" :key="index" @tap="onSelectLabel(index)" >
                        <Label :color="color" :text="index" alignSelf="center"
                            :opacity="(index === selectedColor) ? colorPicker.opacity.selected : colorPicker.opacity.unselected"
                            :height="(index === selectedColor) ? colorPicker.size.selected : colorPicker.size.unselected" 
                            :width="(index === selectedColor) ? colorPicker.size.selected : colorPicker.size.unselected"   
                        class="dot" :backgroundColor="color"/>
                    </FlexboxLayout>
                </FlexboxLayout>

                <GridLayout row="6" rows="auto, auto">
                    <FlexboxLayout row="0" flexDirection="row" justifyContent="space-between">
                        <Label class="h2" text="Check List"/>
                        <Button text="Add" @tap="onAdd"/>
                    </FlexboxLayout >
                    <FlexboxLayout row="1" flexDirection="column">
                        <StackLayout v-for="(item, index) in task.checklist" :key="index" >
                            <CheckBox fontSize="20"
                                @checkedChange="onCheckChange(item)" 
                                :text="item.label" 
                                :checked="item.checked"
                            ></CheckBox>
                        </StackLayout>
                    </FlexboxLayout>
                </GridLayout>
                
            </GridLayout>
        </ScrollView>
    </FlexboxLayout>
</template>





<script>
import { mapGetters } from 'vuex'
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
export default {
    data() {
        return {
            colorPicker: {
                size: {
                    selected: 30,
                    unselected: 20,
                },
                opacity: {
                    selected: .9,
                    unselected: .3
                }
            },
            busy: false,
            modalChoices: ["Add New Task", "Add New Template"],
            selectedModalChoice: 0,
            templateOptions: null,
            selectedTemplateIndex: -1,
            initialPhaseIndex: 1,
            selectedColor: null,
            colors: ['red', 'blue', 'green', 'yellow', 'purple', 'red', 'blue', 'green'],

            task: {},
            template: {
                name: '',
                boardID: null,
                owner: null,
                task: {}
            }

        }
    },
    computed: {
        ...mapGetters([
            'getCurrentBoard',
            'getUserData',
            'getTemplates',
            'getTemplateNames'
        ])
    },
    methods: {
        isValidPhase(index) {
            if (!index) return false;
            if (index < 0 || index > this.getCurrentBoard.data().phases.length - 1) return false;

            return true
        },
        initializeTask() {
            this.initialPhaseIndex = 1
            this.selectedColor = null
            this.task = Object.assign({}, {
                owner: null,
                boardID: null,
                title: null,
                description: '',
                phase: this.getCurrentBoard.data().phases[this.initialPhaseIndex],
                expanded: false,
                label: null,
                hasLabel: false,
                checklist: [],
                hasChecklist: false,
            })
        },
        initializeTemplateOptions() {
            this.templateOptions = []

            this.templateOptions = this.getTemplateNames


            // this.templateOptions.unshift("No Template")

        },
        onSelectedTemplateChanged(e) {
            this.selectedTemplateIndex = e.newIndex

            const template = this.getTemplates[e.newIndex]
            this.task = Object.assign({}, template.data().task)

            // Validate the task phase 
            this.initialPhaseIndex = this.getCurrentBoard.data().phases.indexOf(this.task.phase)
            if (!this.isValidPhase(this.initialPhaseIndex)) {
                // if the phase is invalid, reset it to 0 and let user deal with it
                this.initialPhaseIndex = 0
                this.task.phase = this.getCurrentBoard.data().phases[this.initialPhaseIndex]
            }
            this.selectedColor = this.colors.indexOf(this.task.label)

        },

        onSelectedIndexChange() {
            console.log("FROM onSelectedIndexChange: ",this.selectedModalChoice)
        },
        onCheckChange(item) {
            console.log("from on checkead ", item.checked)
            item.checked = !item.checked
            console.log("from on checked ", item.checked)
        },
        onAdd() {
            prompt({
                title: "Checklist",
                message: "Add a new item",
                okButtonText: 'Add',
                cancelButtonText: "Cancel",
            })
            .then((result)=> {
                //this.checklistItems.push({checked: false, label: "new itemsk"})
                  console.log(`Dialog result: ${result.result}, text: ${result.text}`)
                  if (result.result) {
                    this.task.checklist.push({checked: false, label: result.text})
                    if(!task.hasChecklist) {
                        task.hasChecklist = true
                    }
                  }

            })
        },
        onSelectLabel(index) {
            console.log(index)
            if ( this.selectedColor === index) {
                this.selectedColor = null
                this.task.hasLabel = false
            } else { 
                this.task.hasLabel = true
                this.selectedColor = index
                this.task.label = this.colors[index]
            }
        },
        setBusy(bool){
            this.busy = bool
        },
        onDone() {
        
            
            console.log("FROM DONE")
            console.log(this.task.title)
            console.log(this.task.description)
            console.log(this.initialPhaseIndex)
            if (this.busy) return;

            if(!this.task.title || this.task.title.length === 0) {
                alert('Your new task needs a title')
                .then(() => {
                    console.log("Alert dialog closed.");
                });
                return;
            }
            this.setBusy(true)

            this.task.owner = this.getUserData.uid
            this.task.boardID = this.getCurrentBoard.id
        //     // this.task.phase = this.getCurrentBoard.data().phases[this.initialPhaseIndex]
            console.log(this.task.phase)
            console.log(this.initialPhaseIndex)
            console.log(this.task.label)
            console.log(this.selectedColor)


            if (this.selectedModalChoice === 0) {
                firebase.firestore.collection('tasks').add(this.task)
                .then(() => {
                    this.setBusy(false)
                    this.$modal.close()
                    this.templateOptions = []

                })      
            }
            if (this.selectedModalChoice === 1) {
                this.template.owner = this.getUserData.uid
                this.template.boardID = this.getCurrentBoard.id

                this.template.task = Object.assign({}, this.task)

                firebase.firestore.collection('templates').add(this.template)
                .then(() => {
                    this.setBusy(false)
                    this.$modal.close()
                    this.templateOptions = []
                })
            }


        },
        onChanged(e){
            this.initialPhaseIndex = e.newIndex
            this.task.phase = this.getCurrentBoard.data().phases[e.newIndex]
            console.log(e.newIndex, this.initialPhaseIndex, this.task.phase)
        }
    }, 
    mounted() {
        this.initializeTask()
        this.initializeTemplateOptions()
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
.field2 {
    background-color: lightblue;
}
.dot {
    border-radius: 50%;
    overflow: hidden;
    shape-outside: circle;
}

</style>
