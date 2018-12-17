import Vue from 'nativescript-vue'
import VueDevtools from 'nativescript-vue-devtools'
import Vuex from 'vuex'
import { store } from './store/index.js'


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
      // store.commit('setAuthenticatedUser', data.user.uid)
      // console.log("uID: " + data.user.uid)


      firebase.logout()

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


new Vue({
  store:store,
  render: h => h('frame', [h(store.getters.getAuthenticatedUser ? routes.app : routes.register)])
}).$start()
