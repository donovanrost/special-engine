import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'
import Vuex from 'vuex'
import { store } from './store/index.js'

import axios from 'axios'
import VueAxios from 'vue-axios'

import RadListView from 'nativescript-ui-listview/vue'
import firebase from 'nativescript-plugin-firebase'


import routes from './routes'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')




firebase.init({


  onAuthStateChanged: data => { 
    console.log((data.loggedIn ? "Logged in to firebase" : "Logged out from firebase") + " (firebase.init() onAuthStateChanged callback)");
    if (data.loggedIn) {
      store.commit('setAuthenticatedUser', data.user.uid)
      store.dispatch('fetchUserData', data.user.uid) // DOES THIS LINE NEED TO BE HERE? I DON"T THINK SO, BUT SEEMINGLY it does
    
      // If the account is brand new, create his account scaffolding
      if (data.user.metadata.creationTimestamp.getTime() === data.user.metadata.lastSignInTimestamp.getTime()) {
        store.dispatch('createNewUserDocument', store.getters.getAuthenticatedUser)

      }

    }
    else {
      store.commit('unsetAuthenticatedUser')      
    }
  }
}).then(
    function (instance) {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
);


Vue.use(Vuex)
Vue.use(RadListView)
Vue.use(VueAxios, axios)



new Vue({
  store:store,
  render: h => h('frame', [h(store.getters.getAuthenticatedUser ? routes.app : routes.register)])
}).$start()
