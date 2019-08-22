<template lang="pug">
  .app-wrapper(:class="classObj")
    .drawer-bg(v-if="device === 'mobile' && sidebar.opened" @click="handleClickOutside")
    sidebar.sidebar-container
    .main-container
      div(:class="{'fixed-header': fixedHeader}")
        navbar
      app-main
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/color.styl'

.app-wrapper {
  position relative
  height 100%
  width 100%
  .mobile.openSidebar {
    position fixed
    top 0
  }
  &:after {
    content ""
    display table
    clear both
  }
}
.drawer-bg {
  background #000
  opacity 0.3
  width 100%
  top 0
  height 100%
  position absolute
  z-index 999
}

.fixed-header {
  position fixed
  top 0
  right 0
  z-index 9
  width calc(100% - sideBarWidth)
  transition width 0.28s
}

.hideSidebar .fixed-header {
  width calc(100% - 54px)
}

.mobile .fixed-header {
  width 100%
}
#app {
  .sidebar-container /deep/ {
    transition: width 0.28s;
    width: sideBarWidth !important;
    background-color: menuBg;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    .horizontal-collapse-transition {
      transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }
    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }
    .el-scrollbar__bar.is-vertical {
      right: 0px;
    }
    .el-scrollbar {
      height: 100%;
    }
    &.has-logo {
      .el-scrollbar {
        height: calc(100% - 50px);
      }
    }
    .is-horizontal {
      display: none;
    }
    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }
    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;
    }
    .submenu-title-noDropdown,
    .el-submenu__title {
      &:hover {
        background-color: menuHover !important;
      }
    }
    .is-active>.el-submenu__title {
      color: subMenuActiveText !important;
    }
    .nest-menu .el-submenu>.el-submenu__title,
    .el-submenu .el-menu-item {
      min-width: sideBarWidth !important;
      background-color: subMenuBg !important;
      &:hover {
        background-color: subMenuHover !important;
      }
    }
  }
  .hideSidebar /deep/ {
    .sidebar-container {
      width: 54px !important;
    }
    .main-container {
      margin-left: 54px!important;;
    }
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;
      .el-tooltip {
        display flex!important
        align-items center
        justify-content center
        padding: 0 !important;
      }
    }
    .el-submenu {
      overflow: hidden;
      .el-submenu__title {
        display flex
        align-items center
        justify-content center
        padding: 0 !important;
        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }
    .el-menu--collapse {
      .el-submenu {
        .el-submenu__title {
          span {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }
        }
      }
    }
  }
  .el-menu--collapse .el-menu .el-submenu {
    min-width: sideBarWidth !important;
  }
  .mobile /deep/ {
    .main-container {
      margin-left: 0px;
    }
    .sidebar-container {
      transition: transform .28s;
      width: sideBarWidth !important;
    }
    .hideSidebar {
      .sidebar-container {
        pointer-events: none;
        transition-duration: 0.3s;
        transform: translate3d(-sideBarWidth, 0, 0);
      }
    }
  }
  .withoutAnimation {
    .main-container,
    .sidebar-container {
      transition: none;
    }
  }
}
// when menu collapsed
.el-menu--vertical {
  .nest-menu .el-submenu>.el-submenu__title,
  .el-menu-item {
    &:hover {
      // you can use subMenuHover
      background-color: menuHover !important;
    }
  }
  // the scroll bar appears when the subMenu is too long
  .el-menu--popup {
    max-height: 100vh;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
}
</style>
