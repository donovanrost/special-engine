import store from '@/store/index'
import App from '../../views/App.vue'
import Vue from 'nativescript-vue'


// dispatch actions
// commit mutations

export default function configureModerator (store) {
	store.subscribe(({type, payload },  state,) => {
		switch (type) {
			case 'setAuthenticatedUser': 

				return
		}
	})

	store.subscribeAction(({type, payload}, state) => {
		switch(type) {
			case 'signUserOut': 
				store.commit('unsetAuthenticatedUser')
				//store.commit('unsetUser')
				
				return 
			

		}
	})




}