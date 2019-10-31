<template lang="pug">
  .authority
    .main-title-wrap
      .title-item
        .text 选择用户：
        el-dropdown.select(@command="userSelect" trigger="click")
          .el-dropdown-link
            .name {{user}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="(item, index) in userList" :command="item.name" :key="index") {{item.name}}
    .authority-wrap
      el-checkbox-group(v-model="checkList")
        el-checkbox(v-for="(item, index) in authorityList" :label="item.cnName" :key="index")
    .btn-wrap
      el-button(type="primary" @click="submit") 提交
</template>

<script>

export default {
  data () {
    return {
      user: '',
      // 本地路由列表
      authorityList: [],
      checkList: []
    }
  },
  filters: {
  },
  methods: {
    async userSelect (val) {
      this.checkList = []
      // 从路由获取本地路由表
      await this.setAuthorityList()
      // 获取当前选择用户权限表
      this.userList.map((userItem) => {
        if (userItem.name === val) {
          this.authorityList.map((item) => {
            const result = userItem.authority.some(authorityItem => {
              if (item.name === authorityItem) return true
              return false
            })
            if (result) {
              this.checkList.push(item.cnName)
            }
          })
        }
      })
      this.user = val
    },
    submit () {
      let form = []
      this.authorityList.map((item) => {
        this.checkList.map((checkItem) => {
          if (item.cnName === checkItem) {
            form.push(item.name)
          }
        })
      })
      console.log({name: this.user, authority: [...form]})
     // this.$http.post('/table/list', form)
    },
    setAuthorityList () {
      if (this.authorityList.length) return
      let routes = this.$router.options.routes
      // 遍历本地路由表
      routes.map((item) => {
        // 排除 Login、404等非侧栏控制页面
        if (item.children) {
          item.children.map((page) => {
            // 排除 home
            if (page.name !== 'home') {
              this.authorityList.push({
                name: page.name,
                cnName: item.meta ? (item.meta.title + ' / ' + page.meta.title) : page.meta.title
              })
            }
          })
        }
      })
    }
  },
  created () {
    // checkbox初始化赋值
    this.userSelect(this.userList[0].name)
  }
}
</script>

<style scoped lang="stylus">

.authority {
  padding 20px 30px
  .main-title-wrap {
    display flex
    flex-wrap wrap
    padding 20px 0
    .title-item {
      display flex
      align-items center
      margin-right 80px
      margin-bottom 30px
      .select {
        border 1px solid borderGray
        border-radius 5px
        .el-dropdown-link {
          display flex
          padding 10px
          .name {
            width 80px
            text-align center
          }
        }
      }
    }
  }
  .authority-wrap {
    .el-checkbox {
      margin-right 50px
      margin-bottom 30px
    }
  }
  .btn-wrap {
    padding-top 50px
  }
}
</style>