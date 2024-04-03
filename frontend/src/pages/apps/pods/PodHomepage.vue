<script>
import { get, isEmpty } from 'lodash'

import Dashboard from '@/common/dashboard/DashboardPanels.vue'
import PodDeleteButton from '@/common/apps/Operate/PodDeleteButton.vue'
import ShowYaml from '@/common/apps/Operate/ShowYaml.vue'

import AppConfigInfo from '@/common/apps/AppConfigInfo.vue'
import ContainerList from '@/pages/apps/common/container/list.vue'
import PageHeader from '@/components/header/PageHeader.vue'
import ContainerLog from '@/pages/apps/common/container/containerLog.vue'

import { ONE_HOUR_AS_MS } from '@/constant/index.js'

import { getAppPodDetailAPI } from '@/api/applications'

export default {
  name: 'pod-home-page',
  data () {
    return {
      timeQuery: {
        time: Date.now(),
        range: [Date.now() - ONE_HOUR_AS_MS * 1, Date.now()]
      },
      processing: false,
      podData: {},
      selectedPodData: {},
      drawerVisible: false
    }
  },
  computed: {
    namespace () {
      return this.podData?.namespace || this.podData?.workload?.namespace
    },
    dashboardData () {
      return {
        name: 'pod_detail_metric',
        label: this.$t('applications.runMetric'),
        height: '320px'
      }
    },
    routeQuery () {
      return this.$route.query
    },
    defaultVariables () {
      const { pod } = this.$route.query
      const { namespace } = this
      return {
        namespace,
        pod
      }
    },
    basicData () {
      const { routeQuery: { pod }, podData: { metadata, restartCount } } = this
      return {
        ...this.podData,
        ...metadata,
        workloadName: get(this.podData, 'workload.name'),
        workloadKind: get(this.podData, 'workload.kind'),
        qosClass: get(this.podData, 'status.qosClass'),
        status: get(this.podData, 'status.phase'),
        statusInfo: get(this.podData, 'status') || {},
        restartNum: restartCount,
        pod,
        catalog: get(this.$route, 'params.name'),
        appForm: get(this.$route, 'query.appForm'),
        containerStatuses: get(this.podData, 'status.containerStatuses') || []
      }
    },
    containerList () {
      const list = get(this.podData, 'containers')
      return !isEmpty(list) ? list : []
    }
  },
  methods: {
    getPodDetail () {
      const { application: appName, pod: podName } = this.$route.query
      const self = this

      self.processing = true

      getAppPodDetailAPI({
        appName,
        podName
      }).then(rsp => {
        self.podData = {
          ...rsp.data,
          namespace: get(rsp, 'data.workload.namespace')
        }
      }).finally(() => {
        self.processing = false
      })
    },
    toLogviewer (query = {}) {
      return {
        name: 'logviewer',
        query: {
          namespace: this.namespace,
          ...query,
          isOneHour: true
        }
      }
    },
    toList () {
      const { name, params, query: { application, bdc } } = this.$route
      this.$router.push({
        name,
        params: {
          ...params,
          activeTab: 'podApplication'
        },
        query: {
          application,
          bdc
        }
      })
    },
    async refresh (changeFlag = true) {
      this.getPodDetail()
      if (changeFlag) this.timeQuery.time = Date.now()
    }
  },
  mounted () {
    this.refresh(false)
  },
  components: {
    Dashboard,
    AppConfigInfo,
    PodDeleteButton,
    ShowYaml,
    ContainerList,
    PageHeader,
    ContainerLog
  }
}
</script>

<template lang="pug">
.pod-home-page
  PageHeader(:data="{ content: `Pod: ${routeQuery.pod || $t('applications.noInstance')}` }", :isShowBack="true", @toBack="toList")
    .action-btn.flex
      ShowYaml.mr-2(:data="{ ...basicData, pod: routeQuery.pod, appName: routeQuery.application }", type="pod", :title="`${$t('menu.pods')}：${routeQuery.pod}`")
        el-button(type="primary") {{ $t('common.detail') }}
      el-dropdown.mr-2
        el-button(type="default")
          .flex.items-center
            span {{ $t('common.more') }}
            i.el-icon-arrow-down.mr-0
        template(#dropdown)
          el-dropdown-menu.dropdown-menu-full-button
            el-dropdown-item
              ContainerLog(:podData="{ ...basicData, podName: routeQuery.pod, appName: routeQuery.application }")
                .flex.more-btn
                  i.remix.ri-external-link-line
                  span.ml-1 {{ $t('common.logs') }}
            el-dropdown-item
              PodDeleteButton.mr-2(
                :podData="{ podName: routeQuery.pod, appName: routeQuery.application }",
                @refresh="toList"
              )
                .flex.more-btn
                  i.remix.ri-delete-bin-line
                  span.ml-1 {{ $t('common.remove') }}
      el-button(@click="refresh", type="default")
        i.remix.ri-refresh-line.mr-0
    template(slot="nextRow")
      AppConfigInfo.mt-2(
        :data="basicData",
        type="pod"
      )
  .pod-home-page-box.p-2(v-loading="processing")
    .pods-box.mb-4
      .font-bold.text-high.mb-2 {{ $t('applications.container') }}
      ContainerList.shadow-box.has-border-table(
        v-if="namespace",
        :data="containerList",
        :refreshFlag="timeQuery.time",
        :podData="{ ...basicData, appName: routeQuery.application }"
      )
    .pod-detail-metric-box.mb-3
      .font-bold.text-high.mb-2 {{ $t('applications.runMetric') }}
      .pod-metric-box.shadow-box
        Dashboard(
          :name="dashboardData.name",
          :timeQuery="timeQuery",
          :defaultVariables="defaultVariables"
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
