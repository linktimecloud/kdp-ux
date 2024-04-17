<script>
import { get, isInteger, toNumber, cloneDeep, isObject } from 'lodash'

import CommonTips from '@/common/TipsIcon.vue'
import ResourceColumn from '@/common/dashboard/ResourceColumn.vue'

import { sortListWithoutNull } from '@/utils/utils'
import { formatPrometheusTableData } from '@/utils/cluster/utils'
import { formatTableChartValue } from '@/common/dashboard/utils.js'

import { OVERRIDE_DASHBOARD_COLOR } from '../constant'

import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()

export default {
  name: 'chart-table',
  props: {
    // dataResults=[{target: {}, result: {}}]
    dataResults: {
      type: Array,
      required: true
    },
    rawConfig: Object,
    processing: Boolean,
    panelVariables: Object
  },
  data () {
    return {
      expandCells: {},
      sort: {
        prop: '',
        order: ''
      }
    }
  },
  computed: {
    isAdmin () {
      return globalStore.isAdmin
    },
    columns () {
      return this.rawConfig.columns || []
    },
    showColumns () {
      return this.columns.filter(item => !item.hide)
    },
    columnsData () {
      const { dataResults, columns } = this
      return formatPrometheusTableData({ dataResults, columns })
    },
    list () {
      const { columnsData, columns, sort } = this
      const primaryKey = get(columns.find(item => item.primary), 'key')
      const list = Object.values(columnsData).map(data => {
        return columns.reduce((ret, cur) => {
          const key = cur.metric_key || cur.key
          // 直接返回原始数据 数据为0显示0 为空显示‘-’ jira BPAAS-1761
          ret[key] = data[key]
          return ret
        }, {})
      }).filter(item => item[primaryKey])

      const { prop } = sort
      const order = sort.order === 'descending' ? 'desc' : 'asc'
      return sortListWithoutNull({ list, prop, order })
    },
    isHideTitle () {
      const { hideTitle, visibleSearchBox } = this.rawConfig
      return hideTitle && !visibleSearchBox
    },
    tableStyle () {
      // 兼容以下情况：
      // * 依据数据量大小 渲染高度，避免少量数据的时候有大量空白
      // * 高度auto的时候，在collapseLayout中，会导致折叠展开的时候 table的高度不对，因此在这里计算一个最小高度，确保展开的时候，高度正常
      const height = Math.min(this.list.length * 40, 300)
      return {
        'min-height': `${height}px`
      }
    }
  },
  methods: {
    formatTableChartValue,
    getPrimaryValue (data) {
      // 获取每一项主键列的值(类似每一项的ID，唯一值), 一定是在每一项的metric里面
      return this.columns.reduce((ret, cur) => {
        if (cur.primary) {
          ret += ret ? `_${data[cur.key]}` : data[cur.key]
        }
        return ret
      }, '')
    },
    getCellStyle (column, item) {
      const { metric_key: metricKey, key } = column
      const value = metricKey ? item[metricKey] : item[key]

      const steps = get(column, 'thresholds.steps') || []

      const {
        color = '#262626',
        backgroundColor = 'transparent'
      } = steps.find(s => value !== '' && toNumber(value) >= this.formatMustache(s.value, item)) || {}
      return {
        backgroundColor: OVERRIDE_DASHBOARD_COLOR[backgroundColor] || backgroundColor,
        color: OVERRIDE_DASHBOARD_COLOR[color] || color
      }
    },
    getPercentage (column, item) {
      const { percent_key: percentKey } = column
      const value = item[percentKey]
      const ret = isInteger(value * 100) ? value * 100 : (value * 100).toFixed(1)
      return Math.min(toNumber(ret), 100) || 0
    },
    getPercentColor (column, item) {
      const { percent_key: percentKey } = column
      const value = item[percentKey]
      const steps = get(this.columns.find(item => item.key === percentKey), 'thresholds.steps') || []

      const { color } = steps.find(s => toNumber(value) >= s.value) || {}
      return OVERRIDE_DASHBOARD_COLOR[color] || color
    },
    handleSummary (param) {
      const { showColumns, list } = this
      const sums = []
      showColumns.forEach((item, idx) => {
        if (idx === 0) {
          sums[idx] = this.$t('common.total')
        } else {
          const { key } = item
          const data = list.reduce((ret, cur) => {
            ret += (toNumber(cur[key]) || 0)
            return ret
          }, 0)
          sums[idx] = this.formatTableChartValue(item, {}, data)
        }
      })
      return sums
    },
    formatMustache (value, item) {
      const rege = /\{\{(.+?)\}\}/
      const variable = get(rege.exec(value), '[1]')

      return item[variable] || value
    },
    handleExpandText (column, idx) {
      // 双击需要展开被省略的文字，以便可以进行选中复制
      this.$set(this.expandCells, `${idx}-${column.key}`, true)
    },
    handlerSortBy ({ prop, order }) {
      this.sort = {
        prop,
        order
      }
    }
  },
  mounted () {
    this.sort = this.rawConfig.defaultSort || { prop: this.showColumns[0].key, order: 'ascending' }
  },
  components: {
    CommonTips,
    ResourceColumn
  },
  watch: {
    'panelVariables.sortBy': {
      handler (val) {
        if (isObject(val)) {
          this.sort = cloneDeep(val)
        }
      },
      deep: true
    }
  }
}
</script>

<template lang="pug">
.chart-table.h-full(v-loading="processing")
  el-table.border-left-0.border-right-0.h-full(
    v-if="list.length",
    :data="list",
    border,
    :height="rawConfig.height",
    :show-summary="rawConfig.showSummary",
    :summary-method="handleSummary",
    :class="{ 'border-top-0': isHideTitle }",
    :style="tableStyle",
    :default-sort="panelVariables.sortBy ? {} : sort",
    @sort-change="handlerSortBy"
  )
    el-table-column(
      v-for="column in showColumns",
      :key="column.key",
      :prop="column.key",
      :label="$te(`dashboard.${column.label}`) ? $t(`dashboard.${column.label}`) : column.label",
      show-overflow-tooltip,
      :width="column.width",
      :min-width="column['min-width']",
      :align="column.align",
      :sortable="panelVariables.sortBy ? null : 'custom'"
    )
      template(#header)
        .d-inline-flex
          span {{ $te(`dashboard.${column.label}`) ? $t(`dashboard.${column.label}`) : column.label }}
          CommonTips.ml-1(
            v-if="column.labelTips"
            :name="column.labelTips"
          )
      template(#default="scope")
        .custom-progress-bar.py-2.pl-2.pr-3(v-if="column.layout === 'progressBar'")
          .flex.small.justify-between
            span {{ formatTableChartValue(column, scope.row) }}
            span {{ formatTableChartValue({ ...column, key: column.percent_key, format: 'percent' }, scope.row) }}
          el-progress.w-full.mb-1(
            :percentage="getPercentage(column, scope.row)",
            :stroke-width="8",
            :color="getPercentColor(column, scope.row)"
            :format="() => ('')"
          )
        ResourceColumn.p-2(
          v-else-if="column.layout === 'resourceColumn'",
          v-bind="column.layoutOptions",
          :row="scope.row",
        )
        router-link.pl-2(
          v-else-if="column.key === 'node'",
          target="_blank",
          :to="{ name: 'nodes', query: { id: scope.row.node, name: scope.row.node } }"
        )
          span {{ scope.row.node }}
          i.remix.ri-external-link-line.ml-1
        .cell-box.text-ellipsis(
          v-else,
          :style="formatTableChartValue(column, scope.row) ? getCellStyle(column, scope.row) : ''",
          :class="{ 'expand-text': expandCells[`${scope.$index}-${column.key}`] }"
          @dblclick="handleExpandText(column, scope.$index)",
        ) {{ formatTableChartValue(column, scope.row) ?? '-' }}
  .empty-holder-text.pt-4(v-else)
    img(v-if="parseInt(rawConfig.height) > 200", src="/img/empty_data.svg")
    p {{ $t('common.noData') }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.chart-table {
  td {
    padding: 0;
  }
  .cell-box {
    padding: 8px 10px;
    margin-right: 1px;
    &.expand-text {
      white-space: pre-wrap;
    }
  }
  .el-table {
    font-size: 14px;
    .el-table__cell,
    .cell {
      padding: 0;
    }

    thead {
      th .cell {
        padding: 10px;
      }
    }
    .el-table__footer {
      .el-table__cell {
        padding: 8px;
      }
    }
    .el-progress {
      line-height: 8px;
      .el-progress-bar {
        padding-right: 0;
      }
    }
  }
  .el-table--border .el-table__cell:not(.is-leaf):first-child .cell {
    padding-left: 0;
  }
}
</style>
