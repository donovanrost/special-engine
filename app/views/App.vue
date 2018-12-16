<template>
    <Page>
        <ActionBar title="Welcome to NativeScript-Vue!"/>
        <GridLayout columns="*" rows="*">
            <Label class="message" :text="msg" col="0" row="0"/>
            <Button @tap="test" text="Click me"/>>
        </GridLayout>
    </Page>
</template>

<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
  export default {
    data() {
      return {
        msg: 'Hello World!'
      }
    },
    methods: {
        test() {
            firebase.firestore.collection('test').add({
                test:'asd'
            })
        }
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
