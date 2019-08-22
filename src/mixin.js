import { mapGetters } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
    }
  },
  filters: {
  },
  methods: {
    go(path) {
      this.$router.push(path)
    },
    goBack() {
      this.$router.go(-1)
    },
    // 非空验证
    validate(key) {
      return !key || key.match(/^[ ]+$/)
    },
    // 手机号验证
    isPhone(key) {
      return !(key.length === 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(key))
    },
    // 日期格式化
    formatTime(time, yearKey = '.', monthKey = '.', dayKey = '',
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
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
  },
  mounted() {
  },
  beforeDestory() {
  }
}
