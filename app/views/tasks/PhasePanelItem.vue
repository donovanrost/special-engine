<template>
    <FlexboxLayout class="item list-item" flexDirection="column">
        <Label class="big list-item-title" :text="item.data().title"/>>
        <Label class="list-item-description" :text="item.data().description"/>
        <StackLayout class="list-item-separator" height="2"/>
    </FlexboxLayout>
</template>





<script>
import { mapGetters } from 'vuex'
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
export default {
    props: {
        item:{
            type:Object
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

</style>
