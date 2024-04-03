<script>
import { get, toNumber, isInteger, orderBy, round, isNull } from 'lodash'
import moment from 'moment'
import { beautifyDataUnit, getPercentage } from '@/utils/utils'

import ChartMixin from '@/mixins/chart'
import 'echarts/lib/chart/line'

export default {
  name: 'chart-holder',
  mixins: [ChartMixin],
  props: {
    dataResults: {
      type: Array,
      required: true
    },
    series: {
      type: Array,
      required: true
    },
    rawConfig: Object
  },
  computed: {
    option () {
      const { series, dataResults, rawConfig: { yAxisOverrides, legend, chartGrid, tooltip } } = this

      const self = this
      return {
        grid: {
          top: '30px',
          left: '30px',
          right: '20px',
          bottom: '40px',
          containLabel: true,
          backgroundColor: '#fff',
          ...chartGrid
        },
        legend: {
          show: true,
          bottom: 7,
          icon: 'roundRect',
          itemWidth: 8,
          itemHeight: 4,
          itemGap: 16,
          ...legend
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#8c8c8c'
            }
          },
          textStyle: {
            color: '#262626'
          },
          enterable: true,
          confine: true,
          backgroundColor: '#fff',
          borderColor: '#fff',
          formatter: (params) => {
            const list = params.map((item, idx) => {
              let value
              if (isNull(item.value[1])) {
                value = '-'
              } else {
                value = self.formatterAxisLabel(
                  get(dataResults[idx], 'target') || get(dataResults[0], 'target'),
                  toNumber(item.value[1])
                )
              }

              return {
                value: toNumber(item.value[1]) || 0,
                html: `<div class="d-flex tooltip-item"><span class="mr-3">${item.seriesName}</span><span>${value}</span></div>`
              }
            })
            const htmls = orderBy(list, 'value', 'desc').reduce((ret, cur) => {
              ret += cur.html
              return ret
            }, '')

            return `<div class="timeserise-line-tooltip-content"><div class="mb-2 text-left">${params[0].axisValueLabel}</div>${htmls}</div>`
          },
          ...tooltip
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          splitNumber: 4,
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            hideOverlap: true,
            formatter: function (value) {
              return moment(value).format('HH:mm')
            }
          }
        },
        yAxis: yAxisOverrides
          ? yAxisOverrides.map(item => ({
            type: 'value',
            axisLabel: {
              formatter: function (value) {
                return self.formatterAxisLabel(item, value)
              },
              color: '#262626'
            },
            splitArea: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              },
              show: true
            },
            ...item,
            nameTextStyle: {
              color: '#262626',
              fontWeight: 500,
              ...item.nameTextStyle
            },
            name: this.$te(`dashboard.${item.name}`) ? this.$t(`dashboard.${item.name}`) : item.name
          }))
          : {},
        series
      }
    }
  },
  methods: {
    formatterAxisLabel (config, value) {
      if (config.format === 'number') {
        return Intl.NumberFormat('zh-CN', { useGrouping: true }).format(value)
      }

      if (config.format === 'percent') {
        const percentage = round(getPercentage(value, 1), 1)
        return percentage ? `${percentage}%` : '0%'
      }

      if (config.format === 'bytes') {
        return beautifyDataUnit({ data: parseInt(value) }) || 0
      }

      if (config.format === 'bytes_rate') {
        const ret = beautifyDataUnit({ data: parseInt(value) })
        return ret ? `${ret}/s` : 0
      }

      if (config.format === 'time_ms') {
        return (isInteger(value * 1000) ? value * 1000 : (value * 1000).toFixed(1)) + ' ms'
      }

      // TODO: 4.3需要抽出来 并加上UT
      if (toNumber(value)) {
        const reg = toNumber(value) > 1 ? /^[0-9]*.[0-9]{2}/ : /^[0-9]*.(0)*[0-9]{2}/
        return toNumber(get(value.toString().match(reg), '[0]') || value)
      }

      return value
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<template lang="pug">
.chart-holder.h-full
</template>
