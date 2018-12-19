import Vue from 'vue'
import Router from 'vue-router'

import store from './store/store'
import Home from './views/Home.vue'
import Model from './views/Model.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/model',
      name: 'model',
      component: Model,
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          next(vm => {})
        } else {
          next('/')
        }
      }
    }
  ]
})
