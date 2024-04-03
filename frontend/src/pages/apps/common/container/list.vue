<script>
import ContainerStatus from '@/pages/apps/common/container/containerStatus.vue'
import ContainerLog from '@/pages/apps/common/container/containerLog.vue'
import CommonTips from '@/common/TipsIcon.vue'
import ResourceColumn from '@/common/dashboard/ResourceColumn.vue'

import { formatPrometheusTableData } from '@/utils/cluster/utils'
import { getPercentage } from '@/utils/utils'
import { postDashboardQueryAPI } from '@/api/dashboard'

import { CONTAINER_LIST_TARGETS } from '@/constant/prometheus'

export default {
  name: 'application-container-list',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    refreshFlag: Number,
    podData: {
      type: Object,
      retuired: true
    }
  },
  data () {
    return {
      prometheusData: [],
      processing: {
        prometheus: false
      }
    }
  },
  computed: {
    containerListColumns () {
      return [
        {
          key: 'name',
          label: this.$t('dashboard.containerName')
        },
        {
          key: 'image',
          label: this.$t('applications.image')
        },
        {
          key: 'status',
          label: this.$t('common.status')
        },
        {
          key: 'cpu',
          label: this.$t('common.cpu')
        },
        {
          key: 'memory',
          label: this.$t('common.memory')
        },
        {
          key: 'operate',
          label: this.$t('common.operate')
        }
      ]
    },
    tableList () {
      return this.formatCapacityData(this.data)
    }
  },
  components: {
    ContainerStatus,
    CommonTips,
    ResourceColumn,
    ContainerLog
  },
  methods: {
    getPrometheusData () {
      const self = this
      const { pod } = this.$route.query
      const { namespace } = this.podData || {}

      if (!namespace || !pod) return

      self.processing.prometheus = true
      postDashboardQueryAPI({
        time: Date.now(),
        variables: {
          namespace,
          pod
        },
        targets: CONTAINER_LIST_TARGETS()
      }).then(rsp => {
        const dataResults = Object.values(rsp.data || {})
        self.prometheusData = formatPrometheusTableData({
          dataResults,
          columns: [
            { key: 'container', type: 'metric', primary: true },
            ...(Object.keys(rsp.data || {}).map(key => ({ key })))
          ]
        })
      }).finally(() => {
        self.processing.prometheus = false
      })
    },
    formatCapacityData (list) {
      return list.map(item => {
        const ret = item
        const key = item.name
        const capacityData = this.prometheusData[key] || {}
        return {
          ...ret,
          ...capacityData,
          cpuRequestRate: getPercentage(capacityData.cpuUsed, capacityData.cpuRequest),
          cpuLimitRate: getPercentage(capacityData.cpuUsed, capacityData.cpuLimit),
          memRequestRate: getPercentage(capacityData.memUsed, capacityData.memRequest),
          memLimitRate: getPercentage(capacityData.memUsed, capacityData.memLimit)
        }
      })
    },
    isCapacityUsageProp (prop) {
      return ['cpu', 'memory'].includes(prop)
    },
    getTip (prop) {
      const map = {
        cpu: 'APPLICATION_CPU_USE_REQUEST_LIMIT',
        memory: 'APPLICATION_MEMORY_USE_REQUEST_LIMIT'
      }
      return map[prop]
    }
  },
  mounted () {
    this.getPrometheusData()
  },
  watch: {
    refreshFlag () {
      this.getPrometheusData()
    }
  }
}
</script>

<template lang="pug">
.application-container-list
  el-table.border-none(:data="tableList", border)
    el-table-column(
      v-for="({ key, label }) in containerListColumns",
      :key="key"
      :prop="key",
      :label="label"
    )
      template(v-if="isCapacityUsageProp(key)", #header)
        .d-block {{ label }}
        .flex
          span {{ $t('applications.loadBalancer.useAndRequestAndLimit') }}
          CommonTips(:name="getTip(key)")
      template(#default="scope")
        span(v-if="key === 'status'")
          ContainerStatus(:containers="[scope.row]", :showLabel="true")
        span(v-else-if="isCapacityUsageProp(key)")
          ResourceColumn(:type="key", :row="scope.row")
        span(v-else-if="key === 'operate'")
          ContainerLog(:podData="{ ...podData, podName: podData.pod, containerStatuses: [scope.row] }", :defaultContainer="scope.row.name")
        span(v-else) {{ scope.row[key]}}
</template>
