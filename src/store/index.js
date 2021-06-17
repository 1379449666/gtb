
import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import list from './modules/list'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
// import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
   // 配置
  modules: {
    app,
    user,
    list,
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  // plugins: [createPersistedState({
  //   // storage: window.sessionStorage,
  //   reducer (data) {
  //     return {
  //       // 设置只储存state中的myData
  //       // user: data.user.infos
  //     }
  //  }
  // })],
  getters

})
