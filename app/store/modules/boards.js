import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import axios from 'axios';


const state = {
    currentBoard: null,
    templates: []
}
const getters = {
    getCurrentBoard: (state) => {
        return state.currentBoard
    },
    getTemplates: (state) => {
        return state.templates
    },
    getTemplateNames: (state) => {
        return state.templates.map(template => template.data().name )
    }
}
const mutations = {
    setCurrentBoard: (state, payload) => {
        state.currentBoard = payload
    },
    pushToTemplates: (state, payload) => {
        state.templates.push(payload)
    },
    setTemplates: (state, payload) => {
        state.templates = payload
    }

}
const actions = {
    // expects a boardID
    fetchTemplates: ({commit}, payload) => {
        console.log(1, "FROM FETCHTEMPLATES", payload)
        commit('setTemplates', [])
        firebase.firestore.collection('templates').where('boardID', '==', payload)
        .onSnapshot( (snapshot) => {
            snapshot.docChanges().forEach((change) =>{
                if (change.type === 'added') {
                    //pass the doc so you can have the ID
                    commit('pushToTemplates', change.doc)
                    console.log("TEMPLATE:", change.doc.data())
                }
                if (change.type === 'modified') {
                    console.log("FROM FETCHTEMPLATES CHANGE TYPE IS MODIFIED")
                    console.log(change.doc.data())
                }
                if (change.type === 'removed') {
                    console.log("FROM FETCHTEMPLATES CHANGE TYPE IS REMOVED")
                    console.log(change.doc.data())
                }
                
            })
        })
    }
}

export default {
	state,
	getters,
	actions,
	mutations,
}