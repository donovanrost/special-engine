<template>
    <Page actionBarHidden="true">
        <FlexboxLayout class="page">
            <StackLayout class="form">
                <GridLayout rows="auto, auto, auto">
                    <StackLayout row="0" class="input-field">
                        <TextField class="input" hint="Email" 
                            v-model="email"
                            :isEnabled="!processing"
                            keyboardType="email"
                        ></TextField>
                    </StackLayout>

                    <StackLayout row="1" class="input-field">
                        <TextField class="input" hint="Password" 
                        v-model="password"
                        :isEnabled="!processing"
                        secure="true"
                        ></TextField>
                    </StackLayout>

                </GridLayout>

                <Button text="Log in" class="btn-primary" :isEnabled="!processing"
                    @tap="onLogin"
                ></Button>
            </StackLayout>

        </FlexboxLayout>
    </Page>
</template>
<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";

export default {
    data() {
        return {
            email:null,
            password:null,
            processing: false,


        };
    },
    methods: {
        setProcessing(status){
            this.processing = status
        },
        resetForm() {
            this.email = null
            this.password = null
        },
        onLogin() {
            if(!this.email || !this.password) {
                alert('Please provide both an email and a password')
                .then(() => {
                    console.log("Alert dialog closed.");
                });
                return;
                
            }

            this.setProcessing(true)
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: this.email,
                    password: this.password
                }
            })
            .then(cred => {
                console.log(cred)
                this.setProcessing(false)
                this.resetForm()
            })
            .catch(err => {
                console.log('Firebase Error: ', err)
            })

        }
    }
}
</script>
<style>
.page{
    align-items: center;
    flex-direction: column;
    background-color: #36434D;
}
.form {
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
    vertical-align: middle;
}
.input-field {
    margin-bottom: 25;
    background-color:#96BAD6;
    border-radius: 5;

}
.input{
    font-size: 18;
}
.btn-primary {
    margin: 30 5 15 5;  
    height: 50;
    background-color: #D51A1A;
    border-radius: 5;
    font-size: 20;
    font-weight: 600;
}
.btn-primary:disabled {
  opacity: 0.5;
}
</style>