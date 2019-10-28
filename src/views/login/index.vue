<template lang="pug">
  .login-container
    el-form.login-form(
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      auto-complete="on"
      label-position="left"
    )
      .title-container
        h3.title Login Form
      el-form-item(prop="username")
        span.img-wrap
          img(src="@/assets/user.png")
        el-input(
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        )
      el-form-item(prop="password")
        span.img-wrap
          img(src="@/assets/password.png")
        el-input(
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        )
          span.show-pwd(@click="showPwd")
            img(src="@/assets/password.png")
      el-button(
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      ) Login
      .tips
        span(style="margin-right:20px;") username: admin
        span password: any
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'user',
        password: 'password'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined || this.$route.query.redirect
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          const param = { username: this.loginForm.username.trim(), password: this.loginForm.password }
          let res = await this.$http.post(this.$config.api_url + '/login', param)
          res = res && JSON.parse(res)
          // if (res && res.data && res.data.authorization) {
          //   this.Cookies.set('Token', 'Bearer ' + res.data.authorization)
          //   this.$message('登录成功！')
          //   this.go({ path: this.redirect || '/' })
          // }
          
          // 测试阶段忽略账号验证
          this.Cookies.set('Token', 'res.data.token')
          this.go({ path: this.redirect || '/' })
          this.$message('登录成功！')
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus">
bg = #283443
cursor = #fff
darkGray = #889aa4
lightGray = #eee

@supports (-webkit-mask: none) and (not (cater-color: cursor)) {
  .login-container .el-input input {
    color cursor
  }
}
.login-container {
  min-height 100%
  width 100%
  background-color bg
  overflow hidden
  .login-form {
    position relative
    width 520px
    max-width 100%
    padding 160px 35px 0
    margin 0 auto
    overflow hidden
  }
  .tips {
    font-size 14px
    color #fff
    margin-bottom 10px
    span {
      &first-of-type {
        margin-right 16px
      }
    }
  }
  .img-wrap {
    padding 6px 5px 6px 15px
    color darkGray
    vertical-align middle
    width 30px
    display inline-block
    img {
      width 20px
    }
  }
  .title-container {
    position relative
    .title {
      font-size 26px
      color lightGray
      margin 0px auto 40px auto
      text-align center
      font-weight bold
    }
  }
  .show-pwd {
    position absolute
    right 10px
    top 7px
    font-size 16px
    color darkGray
    cursor pointer
    user-select none
  }
  .el-input {
    display inline-block
    height 47px
    width 85%
    input {
      background transparent
      border 0px
      -webkit-appearance none
      border-radius 0px
      padding 12px 5px 12px 15px
      color lightGray
      height 47px
      caret-color cursor
      &-webkit-autofill {
        box-shadow 0 0 0px 1000px bg inset !important
        -webkit-text-fill-color cursor !important
      }
    }
  }
  .el-form-item {
    border 1px solid rgba(255, 255, 255, 0.1)
    background rgba(0, 0, 0, 0.1)
    border-radius 5px
    color #454545
  }
}
</style>
