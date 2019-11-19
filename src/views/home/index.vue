<template lang="pug">
  .home
    .time-wrap
      .text 对账日期
      el-date-picker.date(
        v-model="time"
        type="date"
        placeholder="选择日期"
      )
      el-button.btn(type="primary") 查询
    .price-wrap
      .price-item(:class="{'checked': totalChecked === 1}" @click="totalChecked = 1")
        .title.gray 实收总金额
        .price 5210.00
        .num
          span.gray 笔数&ensp;
          span.bold 99
        .icon-wrap
          .icon
      .price-item(:class="{'checked': totalChecked === 2}" @click="totalChecked = 2")
        .item-wrap
          .title.gray HIS应收总金额
          .price 5218.00
          .num
            span.gray 笔数&ensp;
            span.bold 10
        .item-wrap
          .title.gray HIS应收总金额（结算日）
          .price 5218.00
          .num
            span.gray 笔数&ensp;
            span.bold 5
        .item-wrap
          .title.gray 差异总金额
          .price 5218.00
          .num
            span.gray 笔数&ensp;
            span.bold 1
        .icon-wrap
          .icon
    .info-wrap
      .info-tab
        span(:class="{'checked': infoChecked === 1}" @click="infoChecked = 1") tab1
        span(:class="{'checked': infoChecked === 2}" @click="infoChecked = 2") tab2
        span(:class="{'checked': infoChecked === 3}" @click="infoChecked = 3") tab3
      .type
        .type-item
          .title
            img(src="@/assets/wechat.png")
            span 微信
          .item-list
            .info
              span.gray 实收总金额
              span 8115.01
            .info
              span.gray 支付笔数
              span 21
            .info
              span.gray 退款笔数
              span 12
        .type-item
          .title
            img(src="@/assets/alipay.png")
            span 支付宝
          .item-list
            .info
              span.gray 实收总金额
              span 8115.01
            .info
              span.gray 支付笔数
              span 21
            .info
              span.gray 退款笔数
              span 12
        .type-item
          .title
            img(src="@/assets/bank.png")
            span 中国银行
          .item-list
            .info
              span.gray 实收总金额
              span 8115.01
            .info
              span.gray 支付笔数
              span 21
            .info
              span.gray 退款笔数
              span 12
      .table
        .table-title 异常账单
        .table-tab
          span(:class="{'checked': tableChecked === 1}" @click="tableChecked = 1") 所有
          span(:class="{'checked': tableChecked === 2}" @click="tableChecked = 2") 长款（渠道多出）
          span(:class="{'checked': tableChecked === 3}" @click="tableChecked = 3") 短款（HS多出）
        el-table(
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          @row-click="rowClick"
          border
          fit
          highlight-current-row
        )
          el-table-column(label="支付系统流水号" prop="id" align="center")
          el-table-column(label="HIS流水号" prop="id")
          el-table-column(label="支付渠道名称" prop="author" width="110" align="center")
          el-table-column(label="金额" prop="pageviews" width="110" align="center")
          el-table-column(label="患者名称" prop="author" width="110" align="center")
          el-table-column(label="交易时间" prop="display_time" width="200" align="center")
          el-table-column(label="业务类型" prop="author" width="200" align="center")
          el-table-column(label="异常状态" prop="statusText" width="200" align="center")
            template(slot-scope="scope")
              el-tag(:type="scope.row.status | statusFilter") {{ scope.row.statusText }}
          el-table-column(label="操作" width="200" align="center")
            template(slot-scope="scope")
              el-button(size="mini" @click="showRefundModel = true") 退款
              el-button(size="mini" @click="showInfoModel = true") 查看
        el-pagination(
          background
          layout="prev, pager, next"
          :page-size="10"
          :total="1000"
          @current-change="changePage"
        )
    el-dialog(title="申请退款" :visible.sync="showRefundModel")
      el-form(:model="form" :rules="rules" ref="form")
        el-form-item(label="退款说明" prop="text" label-width="120px")
          el-input(v-model="form.text" type="textarea" maxlength="50" show-word-limit)
        el-form-item(label="上传图片" prop="fileList" label-width="120px")
          el-upload(
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :file-list="form.fileList"
            list-type="picture"
          )
            el-button(size="small" type="primary") 点击上传
            .el-upload__tip(slot="tip") 只能上传jpg/png文件，且不超过2M
      .dialog-footer(slot="footer")
        el-button(@click="showRefundModel = false, resetForm('form')") 取消
        el-button(type="primary" @click="submitForm('form')") 确定
    el-dialog.info-model(title="详情" :visible.sync="showInfoModel")
      .info-list
        .info-item
          span 支付系统流水号
          span {{row.author}}
        .info-item
          span HIS流水号
          span {{row.title}}
        .info-item
          span 支付渠道名称
          span {{row.author}}
        .info-item
          span 金额
          span {{row.pageviews}}
        .info-item
          span 患者名称
          span {{row.author}}
        .info-item
          span 交易时间
          span {{row.display_time}}
        .info-item
          span 业务类型
          span {{row.display_time}}
        .info-item
          span 异常状态
          el-tag(:type="row.status | statusFilter") {{row.statusText}}
      .dialog-footer(slot="footer")
        el-button(type="primary" @click="showInfoModel = false") 确定
</template>

<script>

export default {
  data () {
    return {
      time: '',
      totalChecked: 1,
      infoChecked: 1,
      tableChecked: 1,
      showRefundModel: false,
      showInfoModel: false,
      list: '',
      form: {
        text: '',
        fileList: [
          {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
          {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        ]
      },
      rules: {
        text: [
          { required: true, message: '请输入退款说明', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      },
      listLoading: false,
      row: ''
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  methods: {
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeUpload (file) {
      let imgType = ['image/jpeg', 'image/jpg', 'image/png']
      const isJPG = imgType.some((item) => {
        if (file.type === item) return true
        return false
      })
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    beforeRemove (file, fileList) {
      fileList.map((item, index) => {
        if (file.uid === item.uid) {
          this.form.fileList.splice(index, 1)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showRefundModel = false
          setTimeout(() => {
            this.$message('提交成功！')
            this.resetForm(formName)
          }, 200)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    rowClick (row) {
      this.row = row
    },
    changePage (page) {
      console.log(page)
    },
    async fetchData () {
      this.listLoading = true
      // const res = await this.$http.get('/table/list')
      // this.list = res.data.items
      this.list = this.defaultList
      this.listLoading = false
    }
  },
  created () {
    this.$http.post('/admin/test')
    this.fetchData()
  }
}
</script>

<style scoped lang="stylus">

.home {
  padding 20px 30px
  .time-wrap {
    display flex
    align-items center
    padding 20px 0
    .date {
      margin 0 15px
    }
  }
  .price-wrap {
    display flex
    padding 10px 0 20px 0
    .price-item {
      position relative
      width fit-content
      padding 10px 50px
      border 1px solid borderGray
      border-radius 5px
      cursor pointer
      .icon-wrap {
        position absolute
        left 0
        bottom -31px
        width 100%
        display none
        justify-content center
        cursor default
        .icon {
          width 18px
          height 18px
          border-top 1px solid #dcdfe6
          border-right 1px solid #dcdfe6
          transform rotate(-45deg)
          background #fff
        }
      }
      &:first-child {
        margin-right 20px
      }
      &:last-child {
        display flex
        .item-wrap {
          position relative
          padding-left 40px
          padding-right 40px
          &:first-child {
            padding-left 0
          }
          &:nth-child(3) {
            padding-right 0
            &:after {
              display none
            }
          }
          &:after {
            content ''
            display flex
            position absolute
            top 10px
            right 0
            width 1px
            height 60px
            background borderGray
          }
        }
      }
      .price {
        padding 10px 0
        color #f1d033
      }
      .num {
        span:last-child {
          font-size 20px
        }
      }
    }
    .checked {
      background #f4f8fd
      .icon-wrap {
        display flex
      }
    }
  }
  .info-wrap {
    padding 15px
    border 1px solid borderGray
    border-radius 5px
    .info-tab {
      display flex
      width fit-content
      margin 20px 0 30px
      border 1px solid borderGray
      border-radius 20px
      span {
        display flex
        align-items center
        justify-content center
        min-width 150px
        height 40px
        border-right 1px solid borderGray
        cursor pointer
        &:last-child {
          border none
        }
      }
      .checked {
        color theme
      }
    }
    .type {
      display flex
      padding-bottom 30px
      .type-item {
        margin-right 20px
        padding 20px 80px 20px 20px
        border 1px solid borderGray
        border-radius 5px
        box-shadow 0 0 5px borderGray
        .title {
          display flex
          align-items center
          padding-bottom 20px
          img {
            width 30px
          }
          span {
            padding-left 10px
          }
        }
        .item-list {
          .info {
            display flex
            padding-bottom 10px
            &:last-child {
              padding-bottom 0
            }
            span:first-child {
              width 100px
            }
          }
        }
      }
    }
    .table {
      .table-title {
        padding-bottom 20px
      }
      .table-tab {
        display flex
        width fit-content
        border-radius 5px
        span {
          display flex
          align-items center
          justify-content center
          width 160px
          height 40px
          cursor pointer
          background #f4f8fd
          border-top 1px solid borderGray
          border-left 1px solid borderGray
          &:first-child {
            border-left 1px solid borderGray
            border-top-left-radius 5px
          }
          &:last-child {
            border-right 1px solid borderGray
            border-top-right-radius 5px
          }
        }
        .checked {
          position relative
          background #fff
          &:after {
            content ''
            display block
            position absolute
            bottom -1px
            left 0
            z-index 2
            width 100%
            height 3px
            background #fff
          }
        }
      }
    }
  }
}
</style>