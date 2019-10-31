import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import app from './modules/app'
import settings from './modules/settings'

import { constantRoutes, resetRouter } from '@/router'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings
  },
  getters,
  state: {
    userInfo: ''
  },
  actions: {
    setUser ({ commit }, data) {
      commit('setUser', data)
    },
    setRouter ({ commit }) {
      commit('setRouter')
    }
  },
  mutations: {
    setUser: (state, data) => {
      state.userInfo = data
    },
    setRouter: (state) => {
      // 递归遍历，没有权限将删除children
      const setChildren = (children) => {
        const newChildren = children.filter((page) => {
          // 子页面与用户权限对应
          state.userInfo.authority.map((authority) => {
            // page.meta.rol为预设不受权限控制页面
            if (authority === page.name && !page.meta.role) {
              page.meta.role = true
            }
          })
          return page.meta.role
        })
        return newChildren
      }
      // 遍历本地路由表
      constantRoutes.map((item) => {
        // 排除 Login、404等非侧栏控制页面
        if (item.children) {
          item.children = setChildren(item.children)
        }
        return item
      })
      resetRouter(constantRoutes)
    }
  }
})

export default store
