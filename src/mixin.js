import { mapGetters } from 'vuex'

export default {
  components: {
  },
  data () {
    return {
      // 接口返回所有用户权限列表
      userList: [
        {
          name: 'admin',
          authority: [
            'state-total',
            'state-warn',
            'bill',
            'authority'
          ]
        },
        {
          name: 'use',
          authority: [
            'state-warn',
            'bill'
          ]
        }
      ],
      // 测试数据
      defaultList: [
        {
          author: "name",
          display_time: "2012-03-11",
          id: "310000201406084114",
          pageviews: 1249,
          status: "draft",
          statusText: "长款",
          title: "中医院"
        },
        {
          author: "name",
          display_time: "2012-03-06",
          id: "310000201406084114",
          pageviews: 1249,
          status: "published",
          statusText: "短款",
          title: "中医院"
        },
        {
          author: "name",
          display_time: "2012-03-09",
          id: "310000201406084114",
          pageviews: 1249,
          status: "deleted",
          statusText: "已处理",
          title: "中医院"
        },
        {
          author: "name",
          display_time: "2012-03-14",
          id: "310000201406084114",
          pageviews: 1249,
          status: "deleted",
          statusText: "已处理",
          title: "中医院"
        },
        {
          author: "name",
          display_time: "2012-03-15",
          id: "310000201406084114",
          pageviews: 1249,
          status: "deleted",
          statusText: "已处理",
          title: "中医院"
        }
      ]
    }
  },
  filters: {
    // 日期格式化
    formatTime (time, yearKey = '.', monthKey = '.', dayKey = '',
      hasHour, hasMinute) {
      const date = new Date(time * 1000)
      const y = 1900 + date.getYear()
      const m = '0' + (date.getMonth() + 1)
      const d = '0' + date.getDate()
      const hour = '0' + date.getHours()
      const minute = '0' + date.getMinutes()
      const resultTime = y + yearKey + m.substring(m.length - 2, m.length) + monthKey + d.substring(d.length - 2, d.length) + dayKey
      if (hasHour && !hasMinute) {
        return resultTime + ' ' + hour.substring(hour.length - 2, hour.length)
      } else if (hasHour && hasMinute) {
        return resultTime + ' ' + hour.substring(hour.length - 2, hour.length) + ':' + minute.substring(minute.length - 2, minute.length)
      }
      return resultTime
    }
  },
  methods: {
    go (path) {
      this.$router.push(path)
    },
    goBack () {
      this.$router.go(-1)
    },
    // 非空验证
    validate (key) {
      return !key || key.match(/^[ ]+$/)
    },
    // 手机号验证
    isPhone (key) {
      return !(key.length === 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(key))
    },
    // 导出excel
    exportExcel (tHeader, filterVal, list, filename, bookType) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, //表头 必填
          data, //具体数据 必填
          filename: filename || 'excel-list', //非必填
          autoWidth: true, //非必填
          bookType: bookType || 'xlsx' //非必填
        })
      })
    },
    // excel数据格式化
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  watch: {
  },
  mounted () {
  },
  beforeDestory () {
  }
}
