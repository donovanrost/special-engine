import Vue from 'nativescript-vue'
import App from './views/App'
import VueDevtools from 'nativescript-vue-devtools'
import RadListView from 'nativescript-ui-listview/vue';
import firebase from 'nativescript-plugin-firebase';

import Register from './views/auth/Register';
import Login from './views/auth/Login'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')




firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}).then(
    function (instance) {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
    }
);



Vue.use(RadListView);

new Vue({
  render: h => h('frame', [h(Login)])
}).$start()
