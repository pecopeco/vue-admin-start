<template lang="pug">
  .state-total
    .main-title-wrap
      .title-item
        .text 所属机构：
        el-dropdown.select(@command="hospitalSelect" trigger="click")
          .el-dropdown-link
            .name {{hospital || '请选择所属机构'}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="(item, index) in hospitalList" :command="item" :key="index") {{item}}
      .title-item
        .text 开始时间：
        el-date-picker.date(
          v-model="startTime"
          type="date"
          placeholder="选择日期"
        )
      .title-item
        .text 结束时间：
        el-date-picker.date(
          v-model="endTime"
          type="date"
          placeholder="选择日期"
        )
      .btn-wrap
        el-button.btn(type="primary") 查询
        el-button.btn(type="primary" v-print="'#print'") 打印
    .table
      el-table#print(
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      )
        el-table-column(label="序号" align="center" width="60")
          template(slot-scope="scope")
            span {{scope.$index + 1}}
        el-table-column(label="账单时间" prop="display_time" align="center")
        el-table-column(label="机构名称" prop="title")
        el-table-column(label="业务类型" prop="author" align="center")
        el-table-column(label="支付类型" prop="author" align="center")
        el-table-column(label="支付来源" prop="author" align="center")
        el-table-column(label="终端号" prop="author" align="center")
        el-table-column(label="设备编码" prop="author" align="center")
        el-table-column(label="客户名称" prop="author" align="center")
        el-table-column(label="客户标识" prop="author" align="center")
        el-table-column(label="支付流水号" prop="id" width="200" align="center")
        el-table-column(label="支付账号" prop="author" align="center")
        el-table-column(label="金额（元）" prop="pageviews" align="center")
      el-pagination(
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="1000"
        @current-change="changePage"
      )
</template>

<script>

export default {
  data () {
    return {
      list: '',
      listLoading: false,
      hospital: '',
      hospitalList: [
        '铜梁中医院',
        '沙坪坝中医院'
      ],
      startTime: '',
      endTime: ''
    }
  },
  filters: {
  },
  methods: {
    hospitalSelect (val) {
      this.hospital = val
    },
    paySelect (val) {
      this.payType = val
    },
    print () {
      window.print()
    },
    changePage (page) {
      console.log(page)
    },
    async fetchData () {
      this.listLoading = true
      this.list = this.defaultList
      this.listLoading = false
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped lang="stylus">

.state-total {
  padding 20px 30px
  .main-title-wrap {
    display flex
    flex-wrap wrap
    padding 20px 0
    .title-item {
      display flex
      align-items center
      margin-right 50px
      margin-bottom 30px
      .select {
        border 1px solid borderGray
        border-radius 5px
        .el-dropdown-link {
          display flex
          padding 10px
          .name {
            width 120px
            text-align center
          }
        }
      }
      .date {
        margin 0 15px
      }
    }
  }
  .detail-wrap {
    display flex
    flex-wrap wrap
    padding-bottom 20px
    .detail-item {
      display flex
      min-width 280px
      padding-right 40px
      padding-bottom 25px
      span:first-child {
        padding-right 20px
      }
    }
  }
  .info-model {
    .info-list {
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
}
</style>