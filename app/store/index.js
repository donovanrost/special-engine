import Vue from 'vue'
import Vuex from 'vuex'

import configureModerator  from './modules/store-moderator'



Vue.use(Vuex)


export const store = new Vuex.Store({
	plugins: [configureModerator],
	modules: {

		configureModerator

	},
	state: {
        counter: 0
	},
	getters: {
        getCounter: (state) => {
            return state.counter
        }

	},
	mutations: {
        increment: (state, payload) => {
            state.counter++
        }

	},
	actions: {

	},




})
