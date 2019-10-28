<template lang="pug">
  .bill
    el-collapse(v-model="active")
      el-collapse-item(title="实时统计" name="1")
        v-chart(:options="bar" ref="chart")
      el-collapse-item(title="订单列表" name="2")
        .table(v-if="list")
          el-table(
            v-loading="listLoading"
            :data="list"
            element-loading-text="Loading"
            @row-click="rowClick"
            border
            fit
            highlight-current-row
          )
            el-table-column(label="下单时间" prop="display_time" sortable width="160" align="center")
            el-table-column(label="订单号" width="200"  prop="id")
            el-table-column(label="订单状态" prop="statusText" align="center")
              template(slot-scope="scope")
                el-tag(:type="scope.row.status | statusFilter") {{ scope.row.statusText }}
            el-table-column(label="异常说明" prop="author" align="center")
            el-table-column(label="支付类型" prop="author" align="center")
            el-table-column(label="支付状态" prop="author" align="center")
            el-table-column(label="订单金额" prop="pageviews" align="center")
            el-table-column(label="HIS收" prop="pageviews" align="center")
            el-table-column(label="平台退" prop="pageviews" align="center")
            el-table-column(label="HIS退" prop="pageviews" align="center")
            el-table-column(label="操作" width="200" align="center")
              template(slot-scope="scope")
                el-button(size="mini" @click="showInfoModel = true") 查看
                el-button(size="mini" @click="showRefundModel = true") 退款
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
          span 下单时间
          span {{row.display_time}}
        .info-item
          span 订单号
          span {{row.title}}
        .info-item
          span 订单状态
          span {{row.author}}
        .info-item
          span 异常说明
          span {{row.pageviews}}
        .info-item
          span 支付类型
          span {{row.author}}
        .info-item
          span 支付状态
          el-tag(:type="row.status | statusFilter") {{row.statusText}}
        .info-item
          span 订单金额
          span {{row.display_time}}
        .info-item
          span HIS收
          span {{row.pageviews}}
        .info-item
          span 平台退
          span {{row.pageviews}}
        .info-item
          span HIS退
          span {{row.pageviews}}
      .dialog-footer(slot="footer")
        el-button(type="primary" @click="showInfoModel = false") 确定
</template>

<script>
import ECharts from 'vue-echarts'
import "echarts/lib/chart/bar"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
import "echarts/lib/chart/line"
import "echarts/lib/component/legend"

export default {
  components: {
    "v-chart": ECharts
  },
  data () {
    return {
      active: ['1', '2'],
      list: '',
      listLoading: false,
      showRefundModel: false,
      showInfoModel: false,
      row: '',
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
      bar: {
        title: {
          text: "当天二十四小时订单实时统计",
          left: 'center',
          top: 12,
          textStyle: {
            fontSize: 16
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '8%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'}
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data:['微信笔数', '支付宝笔数', '微信金额', '支付宝金额'],
          bottom: '0%'
        },
        xAxis: {
          type: 'category',
          data: ['00点-01点', '01点-02点', '02点-03点', '03点-04点', '04点-05点', '05点-06点', '06点-07点', '07点-08点', '08点-09点', '09点-10点', '10点-11点', '11点-12点', '12点-13点', '13点-14点', '14点-15点', '15点-16点', '16点-17点', '17点-18点', '18点-19点', '19点-20点', '20点-21点', '21点-22点', '22点-23点', '23点-24点'],
          axisLabel: {
            interval:0,
            rotate:40
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '笔数（笔）',
            min: 0,
            max: 35,
            interval: 5,
            axisLabel: {
              formatter: '{value} 笔'
            }
          },
          {
            type: 'value',
            name: '金额（元）',
            min: 0,
            max: 180000,
            interval: 30000,
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name:'微信笔数',
            type:'bar',
            data:[2, 5, 14, 24, 14, 4, 9, 17, 25, 33, 1, 5, 1, 6, 1, 9, 4, 9, 1, 5, 22, 9, 6, 11]
          },
          {
            name:'支付宝笔数',
            type:'bar',
            data:[6, 9, 4, 14, 4, 24, 19, 7, 5, 3, 11, 25, 18, 16, 7, 19, 24, 19, 11, 15, 12, 19, 16, 1]
          },
          {
            name:'微信金额',
            type:'line',
            yAxisIndex: 1,
            data:[120000, 150000, 40000, 140000, 110000, 140000, 90000, 170000, 50000, 130000, 110000, 150000, 110000, 160000, 110000, 10000, 140000, 20000, 110000, 150000, 120000, 10000, 160000, 12355]
          },
          {
            name:'支付宝金额',
            type:'line',
            yAxisIndex: 1,
            data:[40000, 10000, 140000, 30000, 60000, 90000, 130000, 120000, 150000, 30000, 10000, 120000, 70000, 60000, 10000, 120000, 40000, 30000, 70000, 100000, 110000, 140000, 60000, 123550]
          }
        ]
      }
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
    async fetchData () {
      this.listLoading = true
      this.list = this.defaultList
      this.listLoading = false
    },
    changePage (page) {
      console.log(page)
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped lang="stylus">

.bill {
  padding 20px 25px
  .el-collapse /deep/ {
    .el-collapse-item__arrow {
      margin 0 0 0 10px
    }
  }
  .echarts {
    width 100%
    height 550px
  }
}
</style>