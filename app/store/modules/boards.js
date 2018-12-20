import * as firebase from "nativescript-plugin-firebase";
import { firestore } from "nativescript-plugin-firebase";
import axios from 'axios';


const state = {
    currentBoard: null
}
const getters = {
    getCurrentBoard: (state) => {
        return state.currentBoard
    }
}
const mutations = {
    setCurrentBoard: (state, payload) => {
        state.currentBoard = payload
    }

}
const actions = {

}

export default {
	state,
	getters,
	actions,
	mutations,
}