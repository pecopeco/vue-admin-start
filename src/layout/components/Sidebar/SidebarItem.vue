<template lang="pug">
  .menu-wrapper(v-if="!item.hidden")
    template(v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow")
      app-link(v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)")
        el-menu-item(
          :index="resolvePath(onlyOneChild.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        )
          img(
            v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :src="require('@/assets/' + (onlyOneChild.meta.icon || (item.meta&&item.meta.icon)) + '.png')")
          span(slot="title") {{ onlyOneChild.meta.title }}
    el-submenu(
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    )
      template(v-if="item.meta" slot="title")
        img(
          v-if="item.meta && item.meta.icon"
          :src="require('@/assets/' + (item.meta && item.meta.icon) + '.png')"
        )
        span(slot="title") {{ item.meta.title }}
      sidebar-item.nest-menu(
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      )
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {}
  },
  computed: {
    device () {
      return this.$store.state.app.device
    }
  },
  mounted () {
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS () {
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    },
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="stylus" scoped>

.menu-wrapper img {
  width 20px
  margin-right 15px
}

</style>
