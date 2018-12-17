import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";

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
    } 
}
const actions = {
    createNewUserDocument: (context, payload) => {
        firebase.firestore.collection('users').doc(payload).set({
            uid: payload,
            maxBoards: 1,
            maxPhases: 4,
            defaultPhases: ['backlog', 'todo', 'doing', 'completed'],
            boards: []

        })
        .then(() => {
            
        })
        .catch(err => {
            console.log(err)
        })
        
    },
    registerNewUserWithEmailAndPassword: ({commit}, {email, password}) => {
        return firebase.createUser({email: email, password: password})
        .then(cred => {
            commit('setAuthenticatedUser', cred.uid)
            commit('registerNewUser')

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
            commit('setAuthenticatedUser', cred.user.uid)
            this.$navigateTo(routes.app, { clearHistory: true })

        })
    }
}

export default {
	state,
	getters,
	actions,
	mutations,
}