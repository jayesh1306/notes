import Vue from 'vue'
import Vuex from 'vuex'

//Modules
import auth from './auth'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user
  }
})