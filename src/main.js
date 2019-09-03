import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import App from './App'
import store from './store'
import router from './router'
import { resetRouter } from '@/router'

import '@/index.styl'

import NProgress from 'nprogress' // 页面顶端进度条
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie'
import fly from 'flyio'

Vue.prototype.resetRouter = resetRouter
Vue.prototype.Cookies = Cookies

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// fly请求全局配置
if (Cookies.get('Token')) {
  fly.config.headers = { 'X-Token': Cookies.get('Token') }
}
function request (url, form = {}, type) {
  NProgress.start()
  const defaultUrl = process.env.VUE_APP_BASE_API
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
  return fly.request(defaultUrl + url, compleForm, {
    method: type,
    timeout: 5000
  }).then((res) => {
    NProgress.done()
    if (res.status === 103) {
      // token过期，跳转登陆页重新获取
      Cookies.remove('Token')
      router.push('/login')
      return
    } else if (type === 'delete' || res.status === 204) {
      return res.text()
    } else if (res.data.state === 'T') {
      return res.data
    } else {
      this.$message.error(JSON.parse(res.data).error.msg)
    }
  }).catch((err) => {
    NProgress.done()
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
      this.$message.error(errortext)
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
  const title = 'Vue Admin Start'
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
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        const res = await request.get('/user/info', { token: Cookies.get('Token') })
        res.data && store.dispatch('setInfo', res.data)
        next()
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
