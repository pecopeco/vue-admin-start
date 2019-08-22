<template lang="pug">
  .dashboard-container
    .dashboard-text name: {{ userInfo.name }}
  </div>
</template>

<script>
import mixin from '@/mixin.js'

export default {
  name: 'Dashboard',
  mixins: [mixin],
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
.dashboard-container {
  margin 30px
  .dashboard-text {
    font-size 30px
    line-height 46px
  }
}
</style>
