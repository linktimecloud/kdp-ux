<script>
import { get, sortBy } from 'lodash'
// import ChartHolder from './chartholder.vue'

export default {
  name: 'chart-timeserise-line',
  props: {
    processing: {
      type: Boolean,
      default: false
    },
    dataResults: {
      type: Array,
      required: true
    },
    rawConfig: Object
  },
  components: {
    // ChartHolder
  },
  computed: {
    graphSeries () {
      const self = this
      const { dataResults } = this
      // dataResults: [{refId: 'COUNT', target: { chartOptions, expr, refId }, result: [{metric, values: [[timestamp, value], [], [] ...]}]}, {}, ... ]
      if (!dataResults || !dataResults.length) {
        return []
      }
      return dataResults.reduce((ret, cur) => {
        const { target = {}, result = [] } = cur || {}

        const data = result.map(item => {
          const values = get(item, 'values') || []
          const d = sortBy(values, (arr) => arr[0])

          return {
            ...target.chartOptions,
            name: self.getLegendText(target.legendFormat, item.metric),
            data: self.formatStepData(d, target.step),
            connectNulls: false
          }
        })
        return ret.concat(data)
      }, [])
    }
  },
  methods: {
    getLegendText (key, metric = {}) {
      return this.$te(`dashboard.${key}`) ? this.$t(`dashboard.${key}`, metric) : key
    },
    formatStepData (list = [], step) {
      if (!step) {
        return list.map(([s, value]) => ([s * 1000, value]))
      }

      // 通过设置的步长给未返回数据的时间段填充null值，优化图表展示
      const ret = []
      list.forEach((item, index) => {
        if (ret.length) {
          const curTime = item[0]
          let lastTime = ret[ret.length - 1][0]
          while (curTime - lastTime > step) {
            ret.push([lastTime + step, null])
            lastTime += step
          }
        }

        ret.push(item)
      })

      return ret.map(([s, value]) => ([s * 1000, value]))
    }
  }
}
</script>

<template lang="pug">
.chart-timeserise-line.h-full(v-loading="processing")
  //- ChartHolder(
  //-   v-if="graphSeries && graphSeries.length",
  //-   :series="graphSeries"
  //-   :dataResults="dataResults",
  //-   :rawConfig="rawConfig"
  //- )
  .empty-holder-text.pt-4
    img(src="/img/empty_data.svg")
    p {{ $t('common.noData') }}
</template>

<style lang="scss">
.timeserise-line-tooltip-content {
  max-height: 150px;
  overflow: auto;
  .tooltip-item {
    justify-content: space-between;
  }
}
</style>
