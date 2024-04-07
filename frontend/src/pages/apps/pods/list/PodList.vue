<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import i18n from '@/i18n'
import { get, omit, isEmpty } from 'lodash'

import PagerBar from '@/components/pager/PagerBar.vue'
import PodDeleteButton from '@/common/apps/Operate/PodDeleteButton.vue'
import ShowYaml from '@/common/apps/Operate/ShowYaml.vue'
import StatusInfo from '@/common/apps/Operate/StatusInfo.vue'
import CommonTips from '@/common/TipsIcon.vue'
import ContainerLog from '@/pages/apps/common/container/containerLog.vue'
import AppStatus from '@/common/apps/AppStatus.vue'
import ResourceColumn from '@/common/dashboard/ResourceColumn.vue'
import EmptyHolder from '@/components/empty/EmptyHolder.vue'

import { timeformat, filterTableList } from '@/utils/utils.js'
import { formatPrometheusTableData } from '@/utils/cluster/utils'
import { getPercentage, sortListWithoutNull } from '@/utils/utils'
import { getAppPodsAPI } from '@/api/applications'
import { postDashboardQueryAPI } from '@/api/dashboard'
import { POD_COLUMNS, CAPACITY_USAGE_COLUMNS, POD_QUS_CLASS, DEFAULT_FILTER, POD_PROPERTIES } from './constant'
import { PODS_LIST_TARGETS } from '@/constant/prometheus'
import { PAGINATION } from '@/constant'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  options: { // hiddenColumns/defaultOrderBy
    type: Object,
    default: () => ({})
  },
  refreshFlag: Number,
  propsFilter: Object
})

const processing = ref({
  pods: false,
  prometheus: false
})
const filter = ref(DEFAULT_FILTER())
const data = ref([])
const pagination = ref(PAGINATION())
const filterList = ref([])
const dataOrder = ref(false)
const dataOrderBy = ref('creationTime')
const prometheusData = ref([])

const columns = computed(() => {
  const hiddenItem = get(props, 'options.hiddenColumns', [])
  return POD_COLUMNS().filter(item => item.show && !hiddenItem.includes(item.prop))
})
const properties = computed(() => {
  const hiddenItem = get(props, 'options.hiddenSearch', [])
  return POD_PROPERTIES().filter(item => !hiddenItem.includes(item.name))
})  
const tableList = computed(() => {
  const { limit, start } = pagination.value
  let ret = filterList.value
  ret = ret.slice(start, start + limit)
  return ret
})
const appName = computed(() => {
  return get (route, 'query.application')
})

const emit = defineEmits(['setPodNames'])

const getList = async () => {
  if (!appName.value) return
  data.value = []
  processing.value.pods = true
  await getAppPodsAPI({
    appName: appName.value
  }).then(rsp => {
    const l = get(rsp, 'data') || []
    data.value = l.map(item => {
      return {
        ...item,
        ...item.metadata,
        pod: get(item.metadata, 'name'),
        workloadName: get(item.workload, 'name'),
        workloadType: get(item.workload, 'kind'),
        status: get(item, 'status.phase'),
        statusInfo: get(item, 'status'),
        containerStatuses: get(item, 'status.containerStatuses', [])
      }
    })
    getFilterList()
    emit('setPodNames', filterList.value.map(item => item.name))
  }).finally(() => {
    processing.value.pods = false
  })
}
const getPrometheusData = async () => {
  processing.value.prometheus = true
  await postDashboardQueryAPI({
    time: Date.now(),
    variables: {},
    targets: PODS_LIST_TARGETS()
  }).then(rsp => {
    const dataResults = Object.values(rsp.data || {})
    prometheusData.value = formatPrometheusTableData({
      dataResults,
      columns: [
        { key: 'pod', type: 'metric', primary: true },
        { key: 'namespace', type: 'metric', primary: true },
        ...(Object.keys(rsp.data || {}).map(key => ({ key })))
      ]
    })
    getFilterList()
  }).finally(() => {
    processing.value.prometheus = false
  })
}
const getFilterList = () => {
  pagination.value = PAGINATION()
  // Step-2: 根据filter过滤数据
  const fList = filterTableList({
    list: data.value,
    filter: filter.value,
    compareFuncs: {
      pod: (itemValue, filterValue) => itemValue.includes(filterValue)
    }
  })
  // Step-2: 填充cpu、mem等数据，来自prometheus
  let list = formatCapacityData(fList)
  // Step-3: 排序
  const o = dataOrder.value ? 'asc' : 'desc'
  list = sortListWithoutNull({ list, prop: dataOrderBy.value, order: o })
  
  filterList.value = list
  pagination.value.total = list.length || 0
}
const formatCapacityData = (list) =>  {
  return list.map(item => {
    const ret = item
    const key = `${item.pod}_${item.namespace}`
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
const reset = () => {
  filter.value = DEFAULT_FILTER()
  dataOrderBy.value = 'createTime'
  dataOrder.value = false
}
const isCapacityUsageProp = (prop) => {
  return CAPACITY_USAGE_COLUMNS.includes(prop)
}
const toHomepage = (val) => {
  const application = get(route, 'query.application')
  const bdc = get(route, 'query.bdc')
  const currentCatalog = get(route, 'params.name')
  return {
    path: `/catalogHomepage/${currentCatalog}`,
    query: {
      pod: val.pod,
      bdc,
      application,
      appForm: get(props.propsFilter, 'appForm')
    }
  }
}
const getTip = (prop) => {
  const map = {
    cpu: 'APPLICATION_CPU_USE_REQUEST_LIMIT',
    memory: 'APPLICATION_MEMORY_USE_REQUEST_LIMIT'
  }
  return map[prop]
}
const refresh = () => {
  getList()
  getPrometheusData()
}
  
onMounted(() => {
  refresh()
})

watch(() => props.refreshFlag, () => {
  refresh()
})
</script>

<template lang="pug">
.application-pods-list
  .application-pods-list-container.shadow-box
    .table-box(v-loading="processing.pods")
      el-table(v-if="tableList.length", :data="tableList", border)
        template(
          v-for="({ prop, label, minWidth, show, tip, align }, idx) in columns",
        )
          el-table-column(
            v-if="show",
            :key="prop + idx",
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false",
            :align="align"
          )
            template(#header)
              template(v-if="isCapacityUsageProp(prop)")
                .d-block {{ label }}
                .flex
                  span {{ $t('applications.loadBalancer.useAndRequestAndLimit') }}
                  CommonTips.ml-1(:name="getTip(prop)")
              .flex(v-else)
                span {{ label }}
                CommonTips.ml-1.tip-box(v-if="tip", :name="tip")
            template(#default="scope")
              span(v-if="prop === 'pod'")
                router-link(:to="toHomepage(scope.row)", target="_blank")
                  span {{ scope.row.pod }}
                  i.remix.ri-external-link-line.ml-1(v-if="scope.row.pod")
              span(v-else-if="prop === 'status'")
                AppStatus(:status="scope.row.status")
                StatusInfo(:data="scope.row", :info="scope.row.statusInfo", type="pod", :title="`${$t('menu.pods')}：${scope.row.pod}`")
              span(v-else-if="prop === 'workloadName'")
                .d-block.pod-font {{ scope.row.workloadName ?? '-' }}
                .d-block.text-gray {{ scope.row.workloadType ?? '-' }}
              span(v-else-if="isCapacityUsageProp(prop)")
                ResourceColumn(:type="prop", :row="scope.row")
              span(v-else-if="prop === 'creationTime'") {{ timeformat(scope.row.creationTime) }}
              span(v-else-if="prop === 'operate'")
                .flex.items-center
                  ShowYaml.after-line(:data="{ ...scope.row, appName }", type="pod", :title="`${$t('menu.pods')}：${scope.row.pod}`")
                  ContainerLog.after-line(:podData="{ ...scope.row, podName: scope.row.pod, appName }")
                  PodDeleteButton(
                    :podData="{ podName: scope.row.pod, appName }",
                    @refresh="refresh"
                  )
              span(v-else) {{ scope.row[prop] ?? '-' }}
      EmptyHolder.m-4(v-else)
      PagerBar(:data="pagination")
</template>

<style lang="scss">
@import '@/assets/root.scss';
.application-pods-list {
  .pod-font {
    color: $font;
  }
  .application-pods-list-container {
    .table-box {
      background: #fff;
    }
  }
}
</style>
