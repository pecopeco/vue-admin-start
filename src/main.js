import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from './store'
import mixin from './mixin'
import { Message } from 'element-ui'
import defaultSettings from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import 'normalize.css/normalize.css' // CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss'

import '@/icons'

Vue.mixin(mixin)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

let utils = {...mixin.methods}
utils.setHttp()

const title = defaultSettings.title || 'Vue Admin Template'
function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = localStorage.getItem('token')

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.state.userInfo) {
        next()
      } else {
        // 测试
        if (process.env.NODE_ENV !== 'production') {
          store.dispatch('setUser', 'yang')
          next()
          return
        }
        let res = await utils.http.post('/getUserInfo')
        if (res) {
          store.dispatch('setUser', res.data)
        } else {
          localStorage.clear()
          Message.error('获取个人信息失败')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
