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


                    <StackLayout row="2" class="input-field">
                        <TextField class="input" hint="Confirm Password" 
                        v-model="confirmPassword"
                        :isEnabled="!processing"
                        secure="true"
                        ></TextField>
                    </StackLayout>

                </GridLayout>

                <Button text="Register" class="btn-primary" :isEnabled="!processing"
                    @tap="onRegister"
                ></Button>
            
            </StackLayout>

            <Label class="login-label sign-up-label" @tap="navigateToLogin">
                <FormattedString>
                    <Span text="Already have an account?"></Span>
                    <Span text=" Login" class="bold"></Span>
                </FormattedString>
            </Label>

        </FlexboxLayout>
    </Page>
</template>
<script>
import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import {mapActions} from 'vuex'
import routes from '../../routes'
export default {
    data() {
        return {
            email:null,
            password:null,
            confirmPassword: null,
            processing: false,

        };
    },
    methods: {
        ...mapActions([
            'registerNewUserWithEmailAndPassword'
        ]),
        navigateToLogin(){
            this.$navigateTo(routes.login)
        },
        setProcessing(status){
            this.processing = status
        },
        resetForm() {
            this.email = null
            this.password = null
            this.confirmPassword=null
        },
        onRegister() {
            if(!this.email || !this.password || !this.confirmPassword) {
                alert('Please provide both an email and a password')
                .then(() => {
                    console.log("Alert dialog closed.");
                });
                return
                
            }
            if(this.password !== this.confirmPassword) {
                alert('Your password confirmation must match your password')
                .then(() => {
                    console.log("Alert dialog closed.");
                });
                return;
            }
            this.setProcessing(true)
            this.registerNewUserWithEmailAndPassword({email: this.email, password: this.password})
            .then(() => {
                this.setProcessing(false)
                this.resetForm()
                this.$navigateTo(routes.app, { clearHistory: true })

            })
            .catch(err => {
                alert(err)
                .then(() => {
                    console.log('Alert dialog closed');
                    this.setProcessing(false)
                    this.resetForm()
                });
                return
            })

        }
    },

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

.login-label {
    horizontal-align: center;
    color: #A8A8A8;
    font-size: 16;
}

.sign-up-label {
    margin-bottom: 20;
}

.bold {
    color: #000000;
}
</style>