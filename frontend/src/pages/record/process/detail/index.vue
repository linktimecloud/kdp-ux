<script>
import PageHeader from '@/common/pageHeader'
import ProcessLogs from '@/common/process'

export default {
  name: 'process-detail',
  computed: {
    id () {
      return this.$route.query.id
    },
    breadcrumb () {
      return {
        name: 'process',
        text: 'menu.processDetail'
      }
    }
  },
  components: {
    PageHeader,
    ProcessLogs
  },
  methods: {
    toList () {
      const { name } = this.$route
      this.$router.push({ name, query: {} })
    }
  }
}
</script>

<template lang="pug">
.process-detail
  PageHeader(
    :data="breadcrumb",
    tip="PROCESS_LOG",
    :override="true",
    :isShowBack="true",
    @toBack="toList"
  )
  ProcessLogs(
    class="process-logs-status",
    :id="id"
  )
</template>

<style lang="scss">
.process-logs-status {
  .filter {
    width: 320px;
  }
  .card-body__content {
    max-height: calc(100vh - 200px);
  }
}
</style>
