import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import app from './modules/app'
import settings from './modules/settings'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings
  },
  getters,
  state: {
    userInfo: {
      name: '',
      avatar: ''
    }
  },
  mutations: {
    setUser: (state, data) => {
      state.userInfo.name = data.name
      state.userInfo.avatar = data.avatar
    }
  },
  actions: {
    setInfo ({ commit }, data) {
      commit('setUser', data)
    }
  }
})

export default store
