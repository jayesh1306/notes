import Vue from 'vue'
import Vuex from 'vuex'

//Modules
import auth from './auth'
import user from './user'
import home from './home'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    home
  }
})