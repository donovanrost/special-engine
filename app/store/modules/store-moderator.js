import store from '@/store/index'
import App from '../../views/App.vue'
import Vue from 'nativescript-vue'


// dispatch actions
// commit mutations

export default function configureModerator (store) {
	store.subscribe(({type, payload },  state,) => {
		switch (type) {
			case 'setAuthenticatedUser': 
                //store.dispatch('fetchUserData', store.getters.getAuthenticatedUser.uid)
                //this.$navigateTo
				return
			case 'registerNewUser':
				console.log('FROM MODERATOR', store.getters.getAuthenticatedUser)
				store.dispatch('createNewUserDocument', store.getters.getAuthenticatedUser)
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