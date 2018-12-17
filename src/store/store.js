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
          resolve();
        })
        .catch(function(error) {
          reject(error)
        });
      })
    }
  },

  mutations: {
    SET_USER: function(state, val) { state.user = val; },
    SET_PORT: function(state, val) { state.device = val; },
    SET_SOFT_PERMISSIONS: function(state, val) { state.softPermissions = val; },
    SET_FORM_EMAIL: function(state, val)    { state.formEmail = val; },
    SET_FORM_PASSWORD: function(state, val) { state.formPassword = val; }
  }
})
