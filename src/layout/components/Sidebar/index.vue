<template lang="pug">
  div(:class="{'has-logo':showLogo}")
    .sidebar-logo-container(:class="{'collapse': isCollapse}")
      transition(name="sidebarLogoFade")
        router-link.sidebar-logo-link(v-if="isCollapse" key="collapse" to="/")
          img.sidebar-logo(v-if="logo" :src="logo")
          h1.sidebar-title(v-else) {{ title }}
        router-link.sidebar-logo-link(v-else key="expand" to="/")
          img.sidebar-logo(v-if="logo" :src="logo")
          h1.sidebar-title {{ title }}
    el-scrollbar(wrap-class="scrollbar-wrapper")
      el-menu(
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        :unique-opened="false"
        active-text-color="#409EFF"
        :collapse-transition="false"
        mode="vertical"
      )
        sidebar-item(
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        )
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: {
    SidebarItem
  },
  data() {
    return {
      title: 'Vue Admin Start',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/color"

.sidebarLogoFade-enter-active {
  transition opacity 1.5s
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity 0
}
.sidebar-logo-container {
  position relative
  width 100%
  height 50px
  line-height 50px
  background #2b2f3a
  text-align center
  overflow hidden
  .sidebar-logo-link {
    height 100%
    width 100%
    .sidebar-logo {
      width 32px
      height 32px
      vertical-align middle
      margin-right 12px
    }
    .sidebar-title {
      display inline-block
      margin 0
      color #fff
      font-weight 600
      line-height 50px
      font-size 14px
      font-family Avenir, Helvetica Neue, Arial, Helvetica, sans-serif
      vertical-align middle
    }
  }
  .collapse {
    .sidebar-logo {
      margin-right 0px
    }
  }
}
</style>
