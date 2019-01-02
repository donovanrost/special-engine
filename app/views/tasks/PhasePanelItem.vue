<template>
    <GridLayout columns="auto, auto, auto" backgroundColor="black">
        <StackLayout col="0" width="10" height="50" class="label"
            :opacity="(item.data().hasLabel) ? 1 : 0"
            :backgroundColor="(item.data().hasLabel) ? item.data().label : 'black' " 
        ></StackLayout>
            
        <StackLayout col="1">
            <Label class="big list-item-title" :text="item.data().title" color="white"/>
            <Label class="list-item-description" :text="item.data().description" color="white"/>
        </StackLayout>
    </GridLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
export default {
    props: {
        item:{
            type: Object
        }
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'getCurrentBoard',
            'getUserData'
        ])
    },
    methods: {
        
    }
};
</script>

<style>

.list-item-title {
    font-size: 24;
    margin-left: 5;
    margin-right: 5
}
.list-item-description {
    font-size: 18;
        margin-left: 5;
    margin-right: 5
}
.list-item-separator {
    background-color: lightslategray;
    /* margin-top: 5;
    margin-bottom: 5; */
}
.label {
    border-radius: 5;
    margin-left: 5;
    /* margin-right: 5; */
}

</style>
