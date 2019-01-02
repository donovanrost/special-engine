import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import axios from 'axios';


const state = {
    authenticatedUser: null
}
const getters = {
    getAuthenticatedUser: (state) => {
        return state.authenticatedUser
    }
}
const mutations = {
    setAuthenticatedUser: (state, payload) => {
        state.authenticatedUser = payload
    },
    unsetAuthenticatedUser: (state, payload) => {
        state.authenticatedUser = null
    },
    registerNewUser: (state, payload) => {
        console.log('new user registered')
    },


}
const actions = {
    registerNewUserWithEmailAndPassword: ({commit}, {email, password}) => {
        return firebase.createUser({email: email, password: password})
        .then(cred => {
            commit('setAuthenticatedUser', cred.uid)
        })

    },
    loginWithEmailAndPassword: ({commit}, {email, password}) => {
        return firebase.login({
            type: firebase.LoginType.PASSWORD,
            passwordOptions: {
                email: email,
                password: password
            }
        })
        .then(cred => {
            console.log(cred)
            commit('setAuthenticatedUser', cred.uid)
            return cred

        })
    }
}

export default {
	state,
	getters,
	actions,
	mutations,
}