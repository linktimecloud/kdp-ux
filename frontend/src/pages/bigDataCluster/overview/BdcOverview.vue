
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { postDashboardQueryAPI } from '@/api/dashboard'
import { get } from 'lodash'

import Dashboard from '@/common/dashboard/DashboardPanels.vue'
import CollapseLayout from '@/common/dashboard/collapseLayout/CollapseLayout.vue'
import PageHeader from '@/components/header/PageHeader.vue'
import DateTimePickeShort from '@/common/dateTimePicker/ShortTime.vue'

import { ONE_DAY_AS_MS, TIME_DURATION_SHORTCUTS } from '@/constant'
import { useBdcStore } from '@/stores/modules/bdc'

const bdcStore = useBdcStore()

const currentBdcNS = computed(() => bdcStore.currentBdcNS)
const currentBdcName = computed(() => bdcStore.currentBdcName)

const getDefaultValue = () => {
  const time = Date.now()
  return {
    time,
    range: [time - 1 * ONE_DAY_AS_MS, time]
  }
}

const timeQueryOverview = ref(getDefaultValue())

const timeQueryWorkload = ref(getDefaultValue())

const filter = ref({
  namespace: '',
  topTenCPUPodNames: '',
  topTenMemoryPodNames: ''
})

const isReday = ref(false)

const refresh = async () => {
  await getResourceTopTenPods()
  const time = Date.now()
  timeQueryOverview.value.time = time
  timeQueryWorkload.value.time = time
}

const getResourceTopTenPods = async () => {
  const { namespace } = filter.value

  const rsp = await postDashboardQueryAPI({
    time: timeQueryWorkload.value.time,
    start: timeQueryWorkload.value.range[0],
    end: timeQueryWorkload.value.range[1],
    variables: {},
    targets: [
      {
        expr: `topk(10,sum(node_namespace_pod_container:container_cpu_usage_seconds_total:sum_irate{namespace="${namespace}"}) by(pod))`,
        datasourceType: 'prometheus'
      },
      {
        expr: `topk(10, sum(container_memory_usage_bytes{namespace="${namespace}"}) by(pod))`,
        datasourceType: 'prometheus'
      }
    ]
  })

  filter.value.topTenCPUPodNames = get(rsp, 'data[0].result', []).map(item => item?.metric?.pod).join('|')
  filter.value.topTenMemoryPodNames = get(rsp, 'data[1].result', []).map(item => item?.metric?.pod).join('|')

  isReday.value = true
}

onMounted(() => {
  filter.value.namespace = currentBdcNS.value
  currentBdcNS.value && getResourceTopTenPods()
})

watch(() => currentBdcNS, (val) => {
  filter.value.namespace = val
  getResourceTopTenPods()
})
</script>

<template lang="pug">
.bdc-resource-overview
  PageHeader(:data="{ content: $t('menu.bigDataClusterOverview'), subTitle: `${$t('cluster.bdc')} ${currentBdcName}` }")
    .action-button.flex
      el-button.ml-2(@click="refresh")
        i.remix.ri-refresh-line
        span {{ $t('common.refresh') }}
  .resource-contains.p-2(v-if="filter.namespace && isReday")
    .bdc-resource-contains.mb-2
      Dashboard(
        name="bdc_resource",
        :time-query="timeQueryOverview",
        :default-variables="filter"
      )
    .bdc-overview-contains.mb-2
      Dashboard(
        name="bdc_overview",
        :time-query="timeQueryOverview",
        :default-variables="filter"
      )
    CollapseLayout.mb-3(
      :data="{ name: 'bdc_pod_metric', label: $t('cluster.dashboard.podResourceUsageTop') }",
      :default-expand="true"
    )
      template(#headerRight)
        DateTimePickeShort.mr-2(
          :model-value="timeQueryWorkload.range",
          :default-shortcut-lable="$t('time.lastestTwentyFourHours')",
          :shortcut-list="TIME_DURATION_SHORTCUTS()",
          :hidden-clear-btn="true",
          @update:modelValue="value => timeQueryWorkload.range = value"
        )
      Dashboard(
        name="bdc_pod_metric",
        :time-query="timeQueryWorkload",
        :default-variables="filter"
      )
</template>

<style lang="scss">
.bdc-resource-overview {

  .bdc-resource-contains,
  .bdc-overview-contains {
    height: 114px;
    .dashboard-name-bdc_resource,
    .dashboard-name-bdc_overview {
      grid-template-columns: repeat(20, 1fr);
    }
    .dashboard-panel-card {
      border-radius: 4px;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.03);
      grid-row-end: 16 !important;
    }
  }

  .dashboard-name-bdc_pod_metric {
    padding-bottom: 8px;
    height: 480px;
    .dashboard-panel-card {
      border-radius: 4px;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.04);
    }
  }
}
</style>
