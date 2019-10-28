<template lang="pug">
  .navbar
    hamburger.hamburger-container(:is-active="sidebar.opened" @toggleClick="toggleSideBar")
    breadcrumb.breadcrumb-container
    .right-menu
      el-dropdown.avatar-container(trigger="click")
        .avatar-wrapper
          img.user-avatar(:src="userInfo.avatar ? userInfo.avatar + '?imageView2/1/w/80/h/80' : defaultAvatar")
          .name admin
          i.el-icon-caret-bottom
        el-dropdown-menu.user-dropdown(slot="dropdown")
          router-link(to="/")
            el-dropdown-item
              span 首页
          el-dropdown-item(divided)
            span(style="display:block;" @click="logout") 退出
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data () {
    return {
      defaultAvatar: require('@/assets/user.png')
    }
  },
  computed: {
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$http.post('/user/logout')
      this.Cookies.remove('Token')
      this.resetRouter
      this.go(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
.navbar {
  height 50px
  overflow hidden
  position relative
  background #fff
  box-shadow 0 1px 4px rgba(0,21,41,.08)

  .hamburger-container {
    line-height 46px
    height 100%
    float left
    cursor pointer
    transition background .3s
    -webkit-tap-highlight-color: transparent

    &:hover {
      background rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float left
  }

  .right-menu {
    float right
    height 100%
    line-height 50px

    &:focus {
      outline none
    }

    .right-menu-item {
      display inline-block
      padding 0 8px
      height 100%
      font-size 18px
      color #5a5e66
      vertical-align text-bottom
    }
    .right-menu-item.hover-effect {
      cursor: pointer
      transition: background .3s
      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
    .avatar-container {
      margin-right 30px
      .avatar-wrapper {
        position relative
        display flex
        align-items center
        cursor pointer
        .user-avatar {
          cursor pointer
          width 30px
          height 30px
          border-radius 10px
        }
        .name {
          padding 0 10px
        }
        .el-icon-caret-bottom {
          font-size 12px
        }
      }
    }
  }
}
.user-dropdown {
  width 90px
  padding 0
  .el-dropdown-menu__item {
    margin-top 0
    padding 0
    text-align center
    span {
      display flex
      align-items center
      justify-content center
      padding 5px 0
    }
  }
  .el-dropdown-menu__item--divided:before {
    display none
  }
}
</style>
