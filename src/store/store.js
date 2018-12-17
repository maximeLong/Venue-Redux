import Vue from 'vue'
import Vuex from 'vuex'

import {initWindow} from './init'
import {initFirebase} from './init'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    device: undefined, //port information for mobile style
    formEmail: '',
    formPassword: '',
    user: null,
    softPermissions: false, //forces user to hit password screen even if auth is valid
    additionalContent: null
  },

  plugins: [
    initWindow,
    initFirebase
  ],

  actions: {
    signInLoad (store) {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(store.state.formEmail, store.state.formPassword)
        .then(function() {
          store.commit('SET_SOFT_PERMISSIONS', true);
          store.commit('SET_FORM_PASSWORD', '')

          //just get the additional info right away
          store.dispatch('getAdditionalContent');

          resolve();
        })
        .catch(function(error) {
          reject(error)
        });
      })
    },

    getModelUrl (store) {
      return new Promise((resolve, reject) => {
        firebase.storage().ref(store.state.user.uid + '/Models/scene.glb').getDownloadURL()
        .then(function(url) {
          resolve(url);
        })
        .catch(function(error) {
          reject(error)
        })
      })
    },

    getAdditionalContent (store) {

      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        //send token to the server and return list of content
        var localUrl = "http://localhost:5000/venue-a2981/us-central1/venueApi";

        fetch(localUrl + '/bucket/' + idToken)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            console.log( data );
            store.commit('SET_ADDITIONAL_CONTENT', data.objects);
          })
          .catch(function(error) {
            console.log('couldnt fetch contents')
          })


      }).catch(function(error) {
        console.log(error)
      });

    }

  },

  mutations: {
    SET_USER: function(state, val)                { state.user = val; },
    SET_PORT: function(state, val)                { state.device = val; },
    SET_SOFT_PERMISSIONS: function(state, val)    { state.softPermissions = val; },
    SET_FORM_EMAIL: function(state, val)          { state.formEmail = val; },
    SET_FORM_PASSWORD: function(state, val)       { state.formPassword = val; },
    SET_ADDITIONAL_CONTENT: function(state, val)  { state.additionalContent = val; }
  }
})
