<script>
import { get, omit, cloneDeep } from 'lodash'

import Ajax from '@/api/ajax'
import Stat from '../charts/stat'
import Bargauge from '../charts/bargauge'
import TimeseriseLine from '../charts/timeseriseLine'
import Table from '../charts/table'
import Logs from '../charts/logs'
// import Logs from '@/common/process/logs'
import CommonDashboardFilter from '@/common/dashboard/filter'

import { OVERRIDE_DASHBOARD_COLOR } from '../constant'
import { rawToDataResults } from './utils'

const reqResourceMap = [
  {
    resource: 'POST_DASHBOARD_QUERY',
    types: ['stat', 'bargauge', 'table']
  },
  {
    resource: 'POST_DASHBOARD_QUERY_RANGE',
    types: ['timeserise-line', 'range-table', 'logs']
  }
]

export default {
  name: 'dashboard-panel-card',
  props: {
    data: {
      type: Object,
      required: true
    },
    name: String,
    timeQuery: Object,
    panelVariables: Object,
    scopeTplList: Array,
    showPanels: Array,
    prometheusHealth: Boolean
  },
  data () {
    return {
      dataResults: [],
      processing: false,
      isExpand: false
    }
  },
  computed: {
    isCollapse () {
      return this.showPanels.includes(this.data.title)
    },
    resource () {
      const { type, resource } = this.data
      return resource || get(reqResourceMap.find(item => item.types.includes(type)), 'resource') || 'POST_DASHBOARD_QUERY'
    },
    chartComponent () {
      // chartlog接受 dataResults 将它作为 data传给 Logs
      const { type } = this.data
      const map = {
        stat: Stat,
        bargauge: Bargauge,
        'timeserise-line': TimeseriseLine,
        table: Table,
        'range-table': Table,
        logs: Logs
      }

      return map[type]
    },
    getPanelStyle () {
      const steps = get(this.data, 'thresholds.steps') || []
      const curVal = get(this.dataResults, '[0].result[0].value[1]')
      const height = get(this.data, 'height')

      const bgColor = get(steps.find(s => curVal >= s.value), 'backgroundColor') || '#fff'
      const color = get(steps.find(s => curVal >= s.value), 'color') || '#262626'
      const textAlign = get(steps, 'textAlign') || 'center'
      return {
        backgroundColor: OVERRIDE_DASHBOARD_COLOR[bgColor] || bgColor,
        color: OVERRIDE_DASHBOARD_COLOR[color] || color,
        textAlign,
        height: height ? 'auto' : '100%',
        maxHeight: height || ''
      }
    },
    formatTitle () {
      const { data: { title }, panelVariables } = this
      return this.$te(`dashboard.${title}`) ? this.$t(`dashboard.${title}`, panelVariables) : title
    },
    omitSortByVariables () {
      return cloneDeep(omit(this.panelVariables, 'sortBy'))
    },
    containerStyle () {
      const { hideTitle, visibleSearchBox, type } = this.data
      let space = 0
      if (!hideTitle) space += 40
      if (visibleSearchBox) space += 58
      const ret = {
        height: `calc(100% - ${space}px)`
      }

      if (['table', 'timeserise-line'].includes(type)) {
        ret.overflow = 'hidden'
      }

      return ret
    }
  },
  methods: {
    getDashboardData () {
      this.resetTargetsStep()

      const self = this
      const { resource, data: { targets, customFormat } = {}, timeQuery: { time, range }, panelVariables } = self
      const d = {
        time: time || Date.now(),
        start: range[0],
        end: range[1],
        variables: panelVariables,
        targets
      }

      self.prometheusHealth && new Ajax({
        resource,
        data: d,
        success (rsp = {}) {
          const rspData = rsp.data || {}
          self.dataResults = rawToDataResults(rspData, targets, customFormat)
        },
        before () {
          self.processing = true
          self.dataResults = []
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    },
    resetTargetsStep () {
      // 根据开始/结束时间 算出合适的step（返回的单位是秒），控制返回数据的条数
      const FIXED_NUM = 120

      const { timeQuery: { range } } = this
      this.data.targets.forEach(item => {
        if (item.stepFormat === 'auto') {
          item.step = Math.max((range[1] - range[0]) / 1000 / FIXED_NUM, 300)
        }
      })
    },
    handleToggle () {
      this.$emit('update:showPanels', [this.data.title])
      this.isExpand = !this.isExpand
      if (!this.isExpand) {
        this.$emit('restoreShowPanels')
      }
    }
  },
  mounted () {
    this.getDashboardData()
  },
  components: {
    CommonDashboardFilter
  },
  watch: {
    timeQuery: {
      handler () {
        this.getDashboardData()
      },
      deep: true
    },
    omitSortByVariables: {
      handler (val, old) {
        if (JSON.stringify(val) !== JSON.stringify(old)) {
          this.getDashboardData()
        }
      },
      deep: true
    }
  }
}
</script>

<template lang="pug">
.dashboard-panel-card(
  :style="getPanelStyle",
  :id="name",
  :ref="name",
  v-show="isCollapse || isExpand",
  :class="isExpand ? 'active' : ''"
)
  .loading-icon.small.text-high(v-show="processing && data.type !== 'table' && data.type !== 'logs'")
    i.remix.ri-loader-line.fa-spin
  .toggle-icon.small.text-high(v-show="data.type === 'logs'")
    el-tooltip(
      :key="name",
      :content="isExpand ? this.$t('common.collapsePanel') : this.$t('common.expandPanel')"
      placement="top"
    )
      span.cursor-pointer(@click.stop="handleToggle()")
        i.ml-2.remix(:class="isExpand ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'")
  .panel-header.w-100.justify-content-between.align-items-center(:class="{ 'd-flex': data.headCompact }")
    .panel-title.mb-1.mx-2(v-show="!data.hideTitle")
      span.title(@click="getDashboardData") {{ formatTitle }}
      el-tooltip(v-if="data.description", :content="this.$te(`dashboard.${data.description}`) ? this.$t(`dashboard.${data.description}`) : data.description", placement="top")
        i.remix.ml-1.text-gray(:class="data.isTipsLineIcon ? 'ri-information-line' : 'ri-information-fill'")
    CommonDashboardFilter.w-auto(
      v-if="data.visibleSearchBox",
      :tplList="scopeTplList",
      :filter="panelVariables",
      :actionBtns="[]",
      :clearable="false"
    )
  .panel-container(:style="containerStyle")
    component(
      :is="chartComponent",
      :dataResults="dataResults",
      :rawConfig="data",
      :processing="processing",
      :panelVariables="panelVariables"
    )
</template>

<style lang="scss">
.dashboard-panel-card {
  border-radius: 4px;
  background-color: #fff;
  text-align: center;
  position: relative;
  overflow: hidden;
  .panel-title {
    padding: 0.75rem 0 0.25rem;
    .title {
      font-weight: 500;
      color: #262626;
    }
    i.ri-information-fill {
      color: #bfbfbf;
    }
  }
  .panel-container {
    overflow-y: auto;
  }

  .loading-icon,
  .toggle-icon {
    position: absolute;
    top: 8px;
    right: 10px;
  }

  .toggle-icon {
    border-left: 1px solid #f0f0f0;
    i {
      color: #595959;
      &:hover {
        color: #416aff;
      }
    }
  }
  &.active {
    grid-area: 1 / 1 / 25 / 25 !important;
  }
}
</style>
