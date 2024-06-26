<script setup>
import { ref, computed, onMounted } from 'vue'
import { get } from 'lodash'
import i18n from '@/i18n'

import Dashboard from '@/common/dashboard/DashboardPanels.vue'
import PodDeleteButton from '@/common/apps/Operate/PodDeleteButton.vue'
import ShowYaml from '@/common/apps/Operate/ShowYaml.vue'
import AppConfigInfo from '@/common/apps/AppConfigInfo.vue'
import ContainerList from '@/pages/apps/common/container/ContainerList.vue'
import PageHeader from '@/components/header/PageHeader.vue'
import ContainerLog from '@/pages/apps/common/container/containerLog.vue'

import { ONE_HOUR_AS_MS } from '@/constant/index.js'
import { getAppPodDetailAPI } from '@/api/applications'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const timeQuery = ref({
time: Date.now(),
range: [Date.now() - ONE_HOUR_AS_MS * 1, Date.now()]
})
const processing = ref(false)
const podData = ref({})

const routeQuery = computed(() => {
  return route.query
})
const namespace = computed(() => {
  return get(podData, 'value.namespace')
})
const dashboardData = computed(() => {
  return {
    name: 'pod_detail_metric',
    label: i18n.t('applications.runMetric'),
    height: '320px'
  }
})
const defaultVariables = computed(() => {
  const { pod } = route.query
  return {
    namespace: namespace.value,
    pod
  }
})
const basicData = computed(() => {
  const pod = get(route, 'query.pod')
  return {
    ...podData.value,
    ...get(podData, 'value.metadata'),
    workloadName: get(podData, 'value.workload.name'),
    workloadKind: get(podData, 'value.workload.kind'),
    qosClass: get(podData, 'value.status.qosClass'),
    status: get(podData, 'value.status.phase'),
    statusInfo: get(podData, 'value.status', {}),
    restartNum: get(podData, 'value.restartCount'),
    pod,
    catalog: get(route, 'params.name'),
    appForm: get(route, 'query.appForm'),
    containerStatuses: get(podData, 'value.status.containerStatuses', []),
    affinity: get(podData, 'value.affinity.podAntiAffinity', {})
  }
})
const containerList = computed(() => {
  return get(podData, 'value.containers', [])
})

const getPodDetail = async () => {
  const { application: appName, pod: podName } = route.query
  processing.value = true
  await getAppPodDetailAPI({
    appName,
    podName
  }).then(rsp => {
    podData.value = {
      ...rsp.data,
      namespace: get(rsp, 'data.workload.namespace')
    }
  }).finally(() => {
    processing.value = false
  })
}
const toList = () => {
  const { name, params, query: { application, bdc } } = route
  router.push({
    name,
    params,
    query: {
      application,
      bdc,
      activeTab: 'podApplication'
    }
  })
}
const refresh = async (changeFlag = true) => {
  await getPodDetail()
  if (changeFlag) timeQuery.value.time = Date.now()
}

onMounted(() => {
  refresh(false)
})
</script>

<template lang="pug">
.pod-home-page
  PageHeader(:data="{ content: `Pod: ${routeQuery.pod || $t('applications.noInstance')}` }", :is-show-back="true", @to-back="toList")
    .action-btn.flex.items-center
      ShowYaml.mr-2(:data="{ ...basicData, pod: routeQuery.pod, appName: routeQuery.application }", type="pod", :title="`${$t('menu.pods')}：${routeQuery.pod}`")
        el-button(type="primary") {{ $t('common.detail') }}
      el-dropdown.mr-2
        el-button(type="default")
          .flex.items-center
            span {{ $t('common.more') }}
            i.ri-arrow-down-s-line.mr-0
        template(#dropdown)
          el-dropdown-menu.dropdown-menu-full-button
            el-dropdown-item
              ContainerLog(:pod-data="{ ...basicData, podName: routeQuery.pod, appName: routeQuery.application }")
                .flex.more-btn
                  i.remix.ri-external-link-line
                  span {{ $t('common.logs') }}
            el-dropdown-item
              PodDeleteButton(
                :pod-data="{ podName: routeQuery.pod, appName: routeQuery.application }",
                @refresh="toList"
              )
                .flex.more-btn
                  i.remix.ri-delete-bin-line
                  span {{ $t('common.remove') }}
      el-button(type="default", @click="refresh")
        i.remix.ri-refresh-line.mr-0
    template(#nextRow)
      AppConfigInfo.mt-2(
        :data="basicData",
        type="pod"
      )
  .pod-home-page-box.p-2(v-loading="processing")
    .pods-box.mb-4
      .font-bold.text-high.mb-2 {{ $t('applications.container') }}
      ContainerList.shadow-box(
        :data="containerList",
        :refresh-flag="timeQuery.time",
        :pod-data="{ ...basicData, appName: routeQuery.application }"
      )
    .pod-detail-metric-box.mb-3
      .font-bold.text-high.mb-2 {{ $t('applications.runMetric') }}
      .pod-metric-box.shadow-box
        Dashboard(
          :name="dashboardData.name",
          :time-query="timeQuery",
          :default-variables="defaultVariables"
        )
</template>

<style lang="scss">
.pod-home-page {
  .pod-metric-box {
    background-color: #fff;
    padding: 0.5rem;
    height: 280px;
    .dashboard-panel-card {
      background-color: #f7f9ff !important;
      border: 0 !important;
    }
  }
}
</style>
