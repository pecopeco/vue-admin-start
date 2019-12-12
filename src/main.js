import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'

// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import App from './App'
import store from './store'
import router from './router'
import { resetRouter } from '@/router'

import NProgress from 'nprogress' // 页面顶端进度条
import 'nprogress/nprogress.css' // progress bar style
import Cookies from 'js-cookie'
import fly from 'flyio'
import mixin from './mixin'
import Print from 'vue-print-nb'

Vue.mixin(mixin)
Vue.use(Print)

Vue.prototype.resetRouter = resetRouter
Vue.prototype.Cookies = Cookies

// set ElementUI lang to EN
Vue.use(ElementUI)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// fly请求全局配置
let config = {
  api_url: process.env.NODE_ENV !== 'production'
  ? '/api'
  : process.env.VUE_APP_MODE === 'stage'
  ? 'https://456.com'
  : 'https://123.com'
}

let requestUrl, requestForm

// 重复请求延迟
function delayRequest () {
  setTimeout(() => {
    requestUrl = ''
    requestForm = {}
  }, 300)
}

// 判断两个对象属性是否完全相同
function isObjectValueEqual (objA, objB) {
  let aProps = Object.getOwnPropertyNames(objA)
  let bProps = Object.getOwnPropertyNames(objB)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]
    let propA = objA[propName]
    let propB = objB[propName]
    if (typeof (propA) === 'object') {
      if (this.isObjectValueEqual(propA, propB)) {
        return true
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}

function request (url, form = {}, type) {
  // 拦截重复请求
  if (requestUrl === url && isObjectValueEqual(requestForm, form)) {
    return
  }
  requestUrl = url
  requestForm = JSON.parse(JSON.stringify(form))

  NProgress.start()
  
  if (Cookies.get('Token')) {
    fly.config.headers = { 'Authorization': Cookies.get('Token') }
  }
  let compleForm = form
  // let presetForm = {
  //   orgName: 123456
  // }
  // Object.assign(compleForm, presetForm)
  if (type === 'post' || type === 'delete' || type === 'put') {
    const formData = new FormData()
    for (const key in form) {
      formData.append(key, form[key])
    }
    compleForm = formData
  }
  return fly.request(config.api_url + url, compleForm, {
    method: type,
    timeout: 5000
  }).then((res) => {
    NProgress.done()
    delayRequest()
    if (type === 'delete' || res.status === 204) {
      return res.text()
    } else if (res.status === 200) {
      return res.data
    } else {
      Message.error(JSON.parse(res.data).error.msg)
    }
  }).catch((err) => {
    NProgress.done()
    delayRequest()
    const codeMessage = {
      200: '服务器成功返回请求的数据.',
      201: '新建或修改数据成功.',
      202: '一个请求已经进入后台排队（异步任务）.',
      204: '删除数据成功.',
      400: '发出的请求有错误，服务器没有进行新建或修改数据的操作.',
      401: '用户没有权限（令牌、用户名、密码错误）.',
      403: '用户得到授权，但是访问是被禁止的.',
      404: '发出的请求针对的是不存在的记录，服务器没有进行操作.',
      406: '请求的格式不可得',
      410: '请求的资源被永久删除，且不会再得到的.',
      422: '当创建一个对象时，发生一个验证错误.',
      500: '服务器发生错误，请检查服务器.',
      502: '网关错误',
      503: '服务不可用，服务器暂时过载或维护.',
      504: '网关超时'
    }
    if (err.status >= 300) {
      const errortext = codeMessage[err.status] || err.response.statusText
      Message.error(errortext)
    }
    if (err.status === 401) {
      // token过期，跳转登陆页重新获取
      console.log('token过期')
      Cookies.remove('Token')
      resetRouter
      router.push(`/login?redirect=${router.history.current.path}`)
    }
  })
}

request.get = (url, form) => request(url, form, 'get')
request.post = (url, form) => request(url, form, 'post')
request.delete = (url, form) => request(url, form, 'delete')
request.put = (url, form) => request(url, form, 'put')

Vue.prototype.$http = request

// token验证、获取用户信息处理
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  const title = '后台管理系统'
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${title}`
  } else {
    document.title = `${title}`
  }
  // determine whether the user has logged in
  const hasToken = Cookies.get('Token')
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 访问页面判断用户权限
      const name = store.state.userInfo.name
      if (name) {
        // 已获取用户信息
        next()
      } else {
        // 第一次登录或者登录后刷新，获取用户信息（包含路由权限）
        // const res = await request.post('/user/info')
        // res && res.data && store.dispatch('setInfo', res.data)
        store.dispatch('setUser', {name: 'admin', avatar: 'avatar', authority: [
          'state-total',
          'state-warn',
          'bill',
          'authority'
        ]}).then(() => {
          // 根据当前用户权限生成路由表
          store.dispatch('setRouter').then(() => {
            next({ ...to, replace: true })
          })
        })
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
