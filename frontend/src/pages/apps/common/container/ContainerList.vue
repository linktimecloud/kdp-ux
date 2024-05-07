<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import i18n from '@/i18n'
import { get } from 'lodash'

import ContainerStatus from '@/pages/apps/common/container/containerStatus.vue'
import ContainerLog from '@/pages/apps/common/container/containerLog.vue'
import CommonTips from '@/common/TipsIcon.vue'
import ResourceColumn from '@/common/dashboard/ResourceColumn.vue'
import WebTerminalButton from '@/components/terminal/WebTerminalButton.vue'

import { formatPrometheusTableData } from '@/utils/cluster/utils'
import { getPercentage } from '@/utils/utils'
import { postDashboardQueryAPI } from '@/api/dashboard'
import { CONTAINER_LIST_TARGETS } from '@/constant/prometheus'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  data: {
    type: Array,
    default: () => ([])
  },
  refreshFlag: Number,
  podData: {
    type: Object,
    required: true
  }
})

const prometheusData = ref([])
const processing = ref({
  prometheus: false
})

const containerListColumns = computed(() => {
  return [
    {
      key: 'name',
      label: i18n.t('dashboard.containerName')
    },
    {
      key: 'image',
      label: i18n.t('applications.image')
    },
    {
      key: 'status',
      label: i18n.t('common.status')
    },
    {
      key: 'cpu',
      label: i18n.t('common.cpu')
    },
    {
      key: 'memory',
      label: i18n.t('common.memory')
    },
    {
      key: 'operate',
      label: i18n.t('common.operate'),
      minWidth: 100
    }
  ]
})
const tableList = computed(() => {
  return formatCapacityData(props.data)
})

const getPrometheusData = () => {
  const pod = get(route, 'query.pod')
  const namespace = get(props, 'podData.namespace')

  if (!namespace || !pod) return

  processing.value.prometheus = true
  postDashboardQueryAPI({
    time: Date.now(),
    variables: {
      namespace,
      pod
    },
    targets: CONTAINER_LIST_TARGETS()
  }).then(rsp => {
    const dataResults = Object.values(rsp.data || {})
    prometheusData.value = formatPrometheusTableData({
      dataResults,
      columns: [
        { key: 'container', type: 'metric', primary: true },
        ...(Object.keys(rsp.data || {}).map(key => ({ key })))
      ]
    })
  }).finally(() => {
    processing.value.prometheus = false
  })
}
const formatCapacityData = (list) => {
  return list.map(item => {
    const ret = item
    const key = item.name
    const capacityData = get(prometheusData, `value.${key}`, {})
    return {
      ...ret,
      ...capacityData,
      cpuRequestRate: getPercentage(capacityData.cpuUsed, capacityData.cpuRequest),
      cpuLimitRate: getPercentage(capacityData.cpuUsed, capacityData.cpuLimit),
      memRequestRate: getPercentage(capacityData.memUsed, capacityData.memRequest),
      memLimitRate: getPercentage(capacityData.memUsed, capacityData.memLimit)
    }
  })
}
const isCapacityUsageProp = (prop) => {
  return ['cpu', 'memory'].includes(prop)
}
const getTip = (prop) => {
  const map = {
    cpu: 'APPLICATION_CPU_USE_REQUEST_LIMIT',
    memory: 'APPLICATION_MEMORY_USE_REQUEST_LIMIT'
  }
  return map[prop]
}

onMounted(() => {
  getPrometheusData()
})

watch(() => props.refreshFlag, () => {
  getPrometheusData()
})
</script>

<template lang="pug">
.application-container-list
  el-table(:data="tableList", border)
    el-table-column(
      v-for="({ key, label, minWidth }) in containerListColumns",
      :key="key"
      :prop="key",
      :label="label",
      :min-width="minWidth",
      :fixed="key === 'operate' ? 'right' : false",
    )
      template(v-if="isCapacityUsageProp(key)", #header)
        .d-block {{ label }}
        .flex
          span {{ $t('applications.loadBalancer.useAndRequestAndLimit') }}
          CommonTips(:name="getTip(key)")
      template(#default="scope")
        span(v-if="key === 'status'")
          ContainerStatus(:containers="[scope.row]", :show-label="true")
        span(v-else-if="isCapacityUsageProp(key)")
          ResourceColumn(:type="key", :row="scope.row")
        span.flex.items-center(v-else-if="key === 'operate'")
          WebTerminalButton.h-full.pt-1.after-line(
            v-if="get(scope.row, 'status.ready', false)",
            sign="podContainer",
            :data="{ appName: route.query?.application, podName: podData.pod, containerName: scope.row.name }",
            :hasIcon="false"
          )
          ContainerLog(:pod-data="{ ...podData, podName: podData.pod, containerStatuses: [scope.row] }", :default-container="scope.row.name")
        span(v-else) {{ scope.row[key]}}
</template>
