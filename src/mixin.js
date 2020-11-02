import fly from 'flyio'
import store from './store'
import dayjs from 'dayjs'
import { Message } from 'element-ui'

const config = {
  api: process.env.NODE_ENV !== 'production'
  ? '/api'
  : process.env.VUE_APP_MODE === 'test'
  ? 'https://test.baidu.com'
  : 'https://baidu.com'
}

export default {
  components: {
  },
  data () {
    return {
      day: dayjs,
      debounceTimer: ''
    }
  },
  filters: {
  },
  methods: {
    go (path) {
      this.$router.push(path)
    },
    goBack (key = -1) {
      this.$router.go(key)
    },
    toast (text, delay = 1500) {
      Message({message: text, duration: delay})
    },
    async getUserInfo () {
      await this.http.post('/getUserInfo')
      store.dispatch('setUser', 'yang')
    },
    http (url, form = {}, type, contentType = 'application/json') {
      url = url.indexOf('http') !== -1 ? url : config.api + url
      if (contentType === 'multipart/form-data') {
        let formData = new FormData()
        for (let key in form) {
          formData.append(key, form[key])
        }
        form = formData
      }
      return fly.request(url, form, {
        method: type,
        'content-type': contentType,
        headers: {
          token: 'xxxxxxxxxxxx'
        },
        timeout: 10000
      }).then((res) => {
        if (res.status === 200) {
          return res.data
        } else {
          Message(`请求错误：${res.message}，状态码：${res.status}`)
        }
      }).catch((err) => {
        Message(`请求错误：${err.message}，状态码：${err.status}`)
      })
    },
    setHttp () {
      this.http.get = (url, form, contentType) => this.http(url, form, 'get', contentType)
      this.http.post = (url, form, contentType) => this.http(url, form, 'post', contentType)
      this.http.delete = (url, form, contentType) => this.http(url, form, 'delete', contentType)
      this.http.put = (url, form, contentType) => this.http(url, form, 'put', contentType)
    },
    // 表单验证
    validate (arr) {
      let err = {}
      arr.some((item) => {
        // 数字转换字符串
        if (typeof (item.key) === 'number') {
          item.key = item.key.toString()
        }
        // 验证非空
        if (!item.key || item.key.match(/^[ ]+$/)) {
          err[item.type] = true
          err.msg = '请填写' + item.name
          return true
        }
        // 验证姓名
        if (item.type === 'name' && (!/^[\u4e00-\u9fa5]+$/.test(item.key) || item.key.length < 2)) {
          err[item.type] = true
          err.msg = '请输入正确的' + item.name
          return true
        }
        // 验证手机号
        if (item.type === 'phone' && !(item.key.length === 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(item.key))) {
          err[item.type] = true
          err.msg = '请输入正确的' + item.name
          return true
        }
        // 验证身份证号
        if (item.type === 'idCard' && !/^\d{6}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(item.key)) {
          err[item.type] = true
          err.msg = '请输入正确的' + item.name
          return true
        }
        // 验证金额
        if (item.type === 'price' && ((!Number.isFinite(Number(item.key)) || Number(item.key) <= 0) || (item.key.split('.')[1] && item.key.split('.')[1].length > 2))) {
          err.msg = '请输入正确的' + item.name
          return true
        }
        // 验证密码必须为数字或字母
        if (item.type === 'password' && (!/^[0-9a-zA-Z]+$/.test(item.key) || item.key.length < 6)) {
          err[item.type] = true
          err.msg = item.key.length < 6 ? '密码至少为6位' : '密码必须包含数字或字母'
          return true
        }
      })
      return Object.keys(err).length ? err : ''
    },
    // 获取url参数
    getQuery (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let param = location.search || location.hash
      let r = param.substr(1).match(reg)
      if (param.split(name).length > 2 && r) {
        param = '?' + param.split(r[0])[param.split(r[0]).length - 1]
        r = param.substr(1).match(reg)
      }
      if (r !== null) return unescape(r[2])
      return null
    },
    // 验证登录账号
    validUsername(str) {
      const valid_map = ['admin', 'editor']
      return valid_map.indexOf(str.trim()) >= 0
    },
    // 是否是外链
    isExternal (path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    },
    debounce (func, delay = 1000){
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      let callNow = !this.debounceTimer
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null
      }, delay)
      if (callNow) {
        func.apply(this, arguments)
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  watch: {
  },
  mounted () {
    this.setHttp()
  },
  beforeDestory () {
  }
}
