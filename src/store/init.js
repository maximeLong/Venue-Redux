const firebase = window.firebase = require('firebase');

//screen resolution check
export const initWindow = (store)=> {

  var _this = this;

  const mobile = 800;
  const desktop = 1280;

  (()=> {
    const WIDTH = window.innerWidth;
    if (WIDTH <= mobile) {
      store.commit('SET_PORT', 'mobile')
    } else if (WIDTH > mobile && WIDTH <= desktop) {
      store.commit('SET_PORT', 'tablet')
    } else {
      store.commit('SET_PORT', 'desktop')
    }
  })();

  window.addEventListener('resize', ()=> {
    const WIDTH = window.innerWidth;
    if (WIDTH <= mobile) {
      store.commit('SET_PORT', 'mobile')
    } else if (WIDTH > mobile && WIDTH <= desktop) {
      store.commit('SET_PORT', 'tablet')
    } else {
      store.commit('SET_PORT', 'desktop')
    }
  });
}

//begin firebase
export const initFirebase = (store)=> {
  const config =
  {
    apiKey: "AIzaSyBBeEWuVVN2Y8O3lTODF3yCIm47RkwaQJA",
    authDomain: "venue-a2981.firebaseapp.com",
    databaseURL: "https://venue-a2981.firebaseio.com",
    projectId: "venue-a2981",
    storageBucket: "venue-a2981.appspot.com",
    messagingSenderId: "848327294810"
  };
  firebase.initializeApp(config);

  //set auth watcher
  firebase.auth().onAuthStateChanged((user)=> {
    if (user) {
      var userData = {
        email: user.email,
        uid: user.uid,
        providerData: user.providerData,
        metaData: user.metadata
      }
      store.commit('SET_USER', userData)
    } else {
      store.commit('SET_USER', null)
    }
  });
}
