<template lang="pug">
  .app-container
    el-table(
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    )
      el-table-column(align="center" label="ID" width="95")
        template(slot-scope="scope")
      el-table-column(label="Title")
        template(slot-scope="scope")
      el-table-column(label="Author" width="110" align="center")
        template(slot-scope="scope")
      el-table-column(label="Pageviews" width="110" align="center")
        template(slot-scope="scope")
      el-table-column(class-name="status-col" label="Status" width="110" align="center")
        template(slot-scope="scope")
      el-table-column(align="center" prop="created_at" label="Display_time" width="200")
        template(slot-scope="scope")
</template>

<script>

export default {
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
  data () {
    return {
      list: null,
      listLoading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.listLoading = true
      const res = await this.$http.get('/table/list')
      this.list = res.data && res.data.items
      this.listLoading = false
    }
  }
}
</script>
