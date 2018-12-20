import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import axios from 'axios';


const state = {
    userData: null
}
const getters = {
    getUserData: (state) => {
        return state.userData
    }
}
const mutations = {
    setUserData: (state, payload) => {
        state.userData = payload
    },
    unsetUserData: (state, payload) => {
        state.userData = null
    },

    finishedCreatingNewUser: (state, payload) => {
        console.log('finsihed creating new user')
    }

}
const actions = {
    createNewUserDocument: ({commit}, payload) => {
        return axios.post('https://us-central1-tasks-991b8.cloudfunctions.net/initializeNewUser', {
            uid: payload,
        })
        .then((res) => {
            commit('finishedCreatingNewUser')
        })
        .catch(err => {
            console.log(err)
        })
        
    },
    fetchUserData: ({commit, getters}, payload) => {
        return firebase.firestore.collection('users').doc(payload).get()
        .then(doc => {
            if(doc.exists) {
                commit('setUserData', doc.data())
                console.log('FROM FETCH USER DATA: ', getters.getUserData.boards[0])
            }
        })
    }

}

export default {
	state,
	getters,
	actions,
	mutations,
}