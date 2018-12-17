import Vue from 'vue'
import Vuex from 'vuex'


import configureModerator  from './modules/store-moderator'
import auth from './modules/auth'


Vue.use(Vuex)


export const store = new Vuex.Store({
	plugins: [configureModerator],
	modules: {
        auth: auth,
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
