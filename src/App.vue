<template lang="pug">
  #app
    router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">

body {
  height 100%
  -moz-osx-font-smoothing grayscale
  -webkit-font-smoothing antialiased
  text-rendering optimizeLegibility
  font-family Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
}
label {
  font-weight 700
}
html {
  height 100%
  box-sizing border-box
}
#app {
  height 100%
  .main-container {
    min-height 100%
    transition margin-left .28s
    margin-left sideBarWidth
    position relative
  }
}
.gray {
  color fontGray
}
.bold {
  font-weight bold
}
.red {
  color red
}
textarea {
  min-height 180px
}
// 日期选择
.date {
  .el-input__inner {
    cursor pointer
  }
}
// 分页
.el-pagination {
  margin-top 40px
  margin-bottom 20px
  text-align right
}
// 下拉框
.select {
  cursor pointer
}
// 输入框
.el-input {
  width auto
}
// 信息弹窗
.info-model {
  .info-list {
    max-height 500px
    overflow-y auto
    .info-item {
      display flex
      align-items center
      padding 20px 0
      border-bottom 1px solid borderGray
      span:first-child {
        width 140px
      }
    }
  }
  }
*,
*:before,
*:after {
  box-sizing inherit
}
a:focus,
a:active {
  outline none
}
a,
a:focus,
a:hover {
  cursor pointer
  color inherit
  text-decoration none
}
div:focus {
  outline none
}
.clearfix {
  &:after {
    visibility hidden
    display block
    font-size 0
    content " "
    clear both
    height 0
  }
}
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight 400 !important
}
.el-upload {
  input[type="file"] {
    display none !important
  }
}
.el-upload__input {
  display none
}
// to fixed https://github.com/ElemeFE/element/issues/2461
.el-dialog {
  transform none
  left 0
  position relative
  margin 0 auto
}
// refine element ui upload
.upload-container {
  .el-upload {
    width 100%

    .el-upload-dragger {
      width 100%
      height 200px
    }
  }
}
// dropdown
.el-dropdown-menu {
  a {
    display block
  }
}
.fade-enter-active,
.fade-leave-active {
  transition opacity 0.28s
}
.fade-enter,
.fade-leave-active {
  opacity 0
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition all .5s
}
.fade-transform-enter {
  opacity 0
  transform translateX(-30px)
}
.fade-transform-leave-to {
  opacity 0
  transform translateX(30px)
}

/* breadcrumb transition */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition all .5s
}
.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity 0
  transform translateX(20px)
}
.breadcrumb-move {
  transition all .5s
}
.breadcrumb-leave-active {
  position absolute
}
</style>
