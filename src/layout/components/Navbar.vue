<template lang="pug">
  .navbar
    hamburger.hamburger-container(:is-active="sidebar.opened" @toggleClick="toggleSideBar")
    breadcrumb.breadcrumb-container
    .right-menu
      el-dropdown.avatar-container(trigger="click")
        .avatar-wrapper
          img.user-avatar(:src="userInfo.avatar + '?imageView2/1/w/80/h/80'")
          i.el-icon-caret-bottom
        el-dropdown-menu.user-dropdown(slot="dropdown")
          router-link(to="/")
            el-dropdown-item Home
          a(target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/")
            el-dropdown-item Github
          a(target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/")
            el-dropdown-item Docs
          el-dropdown-item(divided)
            span(style="display:block;" @click="logout") Log Out
</template>

<script>
import mixin from '@/mixin.js'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  mixins: [mixin],
  computed: {
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$http.post('/user/logout')
      this.Cookies.remove('Token')
      this.resetRouter
      this.go(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
