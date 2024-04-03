<script>
import { mapGetters } from 'vuex'
import Ajax from '@/api/ajax'
import { get } from 'lodash'

import Dashboard from '@/common/dashboard'
import CollapseLayout from '@/common/dashboard/collapseLayout'
import PageHeader from '@/common/pageHeader'
import DateTimePickeShort from '@/common/dateTimePicker/shortTime'

import { ONE_DAY_AS_MS, TIME_DURATION_SHORTCUTS } from '@/constant'

export default {
  name: 'bigDataClusterOverview',
  data () {
    return {
      timeQueryOverview: {
        time: Date.now(),
        range: [Date.now() - 1 * ONE_DAY_AS_MS, Date.now()]
      },
      timeQueryWorkload: {
        time: Date.now(),
        range: [Date.now() - 1 * ONE_DAY_AS_MS, Date.now()]
      },
      filter: {
        namespace: '',
        topTenCPUPodNames: '',
        topTenMemoryPodNames: ''
      },
      bdcList: [],
      isReday: false
    }
  },
  computed: {
    ...mapGetters([
      'isAdmin',
      'userOrgName',
      'currentBdcNS',
      'currentBdcName'
    ]),
    shortcutList () {
      return TIME_DURATION_SHORTCUTS()
    }
  },
  methods: {
    async refresh () {
      await this.getResourceTopTenPods()
      const time = Date.now()
      this.timeQueryOverview.time = time
      this.timeQueryWorkload.time = time
    },
    getResourceTopTenPods () {
      const self = this
      const { timeQueryWorkload, filter: { namespace } } = self

      return new Ajax({
        resource: 'POST_DASHBOARD_QUERY',
        data: {
          time: timeQueryWorkload.time,
          start: timeQueryWorkload.range[0],
          end: timeQueryWorkload.range[1],
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
        },
        success (rsp = {}) {
          self.filter.topTenCPUPodNames = get(rsp, 'data[0].result', []).map(item => item?.metric?.pod).join('|')
          self.filter.topTenMemoryPodNames = get(rsp, 'data[1].result', []).map(item => item?.metric?.pod).join('|')

          self.isReday = true
        }
      }).fetch()
    }
  },
  components: {
    Dashboard,
    CollapseLayout,
    PageHeader,
    DateTimePickeShort
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')

    const { currentBdcNS } = this
    this.filter.namespace = currentBdcNS

    currentBdcNS && this.getResourceTopTenPods()
  },
  watch: {
    currentBdcNS (val) {
      this.filter.namespace = val
      this.getResourceTopTenPods()
    }
  }
}
</script>
<template lang="pug">
.bdc-resource-overview
  PageHeader(:data="{ content: $t('menu.bigDataClusterOverview'), subTitle: `${$t('cluster.bdc')} ${currentBdcName}` }")
    .action-button.d-flex
      el-button.ml-2(@click="refresh")
        i.mr-0.remix.ri-refresh-line
  .resource-contains.p-2(v-if="filter.namespace && isReday")
    .bdc-resource-contains.mb-2
      Dashboard(
        name="bdc_resource",
        :timeQuery="timeQueryOverview",
        :defaultVariables="filter"
      )
    .bdc-overview-contains.mb-2
      Dashboard(
        name="bdc_overview",
        :timeQuery="timeQueryOverview",
        :defaultVariables="filter"
      )
    CollapseLayout.mb-3(
      :data="{ name: 'bdc_pod_metric', label: $t('cluster.dashboard.podResourceUsageTop') }",
      :defaultExpand="true"
    )
      DateTimePickeShort.mr-2(
        slot="headerRight",
        v-model="timeQueryWorkload.range",
        :defaultShortcutLable="$t('time.lastestTwentyFourHours')",
        :shortcutList="shortcutList",
        :hiddenClearBtn="true"
      )
      Dashboard(
        name="bdc_pod_metric",
        :timeQuery="timeQueryWorkload",
        :defaultVariables="filter"
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
