import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'
import user from './user'
import home from './home'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    auth,
    user,
    home
  ],
  mode: 'history',
  base: process.env.BASE_URL,
});


export default router