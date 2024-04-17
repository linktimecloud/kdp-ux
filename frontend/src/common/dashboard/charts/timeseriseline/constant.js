import i18n from '@/i18n'
import moment from 'moment'
import { get, isNull, orderBy, toNumber } from 'lodash'
import { formatterAxisLabel } from '@/common/dashboard/utils.js'

export const formatChartOption = (data) => {
  const { dataResults, rawConfig: { yAxisOverrides, legend, chartGrid, tooltip } } = data

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
            value = formatterAxisLabel(
              get(dataResults[idx], 'target') || get(dataResults[0], 'target'),
              toNumber(item.value[1])
            )
          }

          return {
            value: toNumber(item.value[1]) || 0,
            html: `<div class="flex tooltip-item"><span class="mr-3">${item.seriesName}</span><span>${value}</span></div>`
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
            return formatterAxisLabel(item, value)
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
        name: i18n.te(`dashboard.${item.name}`) ? i18n.t(`dashboard.${item.name}`) : item.name
      }))
      : {}
  }
}