<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { get } from 'lodash'

import PageHeader from '@/components/header/PageHeader.vue'
import ProcessLogs from '@/common/process/ProcessContent.vue'

const route = useRoute()
const router = useRouter()

const id = computed(() => {
  return get(route, 'query.id')
})

const toList = () => {
  const { name } = route
  router.push({ name, query: {} })
}
</script>

<template lang="pug">
.process-detail
  PageHeader(
    :data="{ content: $t('menu.processDetail')}",
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
