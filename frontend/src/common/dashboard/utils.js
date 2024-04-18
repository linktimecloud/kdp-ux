import { toNumber, get, sortBy, round, isInteger } from 'lodash'
import { beautifyDataUnit, getPercentage } from '@/utils/utils'
import i18n from '@/i18n'

const formatDecimal = (value) => {
  // 如果toNumber有值，保证小数点的0后面有两位有效数，防止出现 0.00 这样的值
  if (toNumber(value)) {
    const reg = toNumber(value) > 1 ? /^[0-9]*.[0-9]{2}/ : /^[0-9]*.(0)*[0-9]{2}/
    return toNumber(get(value.toString().match(reg), '[0]') || value)
  }

  return value
}

const formatPercent = (value) => {
  const percentage = round(getPercentage(value, 1), 1)
    return percentage ? `${percentage}%` : '0%'
}

const formatBytesRate = (value, decimalDigits, emptyValue = 0) => {
  const ret = beautifyDataUnit({ data: toNumber(value), decimalDigits })
  return ret ? `${ret}/s` : emptyValue
}

const formatTimeMs = (value) => {
  return (isInteger(value * 1000) ? value * 1000 : (value * 1000).toFixed(1)) + ' ms'
}

const formatDurationTime = (value) => {
  return value * 1 ? formatDurationTime(value) : ''
}



export const formatterAxisLabel = (config, value) => {
  const formatMap = {
    percent: formatPercent(value),
    bytes: beautifyDataUnit({ data: toNumber(value) }) || 0,
    bytes_rate: formatBytesRate(value, 2),
    time_ms: formatTimeMs(value)
  }

  let ret = formatMap[config.format] ?? value
  ret = formatDecimal(ret)

  return ret
}

export const formatTableChartValue = (column, item, formatValue) => {
  const { format, metric_key: metricKey, key } = column
  const value = formatValue || (metricKey ? item[metricKey] : item[key])

  const formatMap = {
    percent: formatPercent(value),
    bytes: beautifyDataUnit({ data: toNumber(value), decimalDigits: 2 }) || 0,
    bytes_rate: formatBytesRate(value, 2, ''),
    duration_time: formatDurationTime(value)
  }

  let ret = formatMap[format] ?? value
  ret = formatDecimal(ret)

  return ret
}

export const getLegendText = (key, metric = {}) => {
  return i18n.te(`dashboard.${key}`) ? i18n.t(`dashboard.${key}`, metric) : key
}

export const formatTimeseriseLineStepData = (list = [], step) => {
  if (!step) {
    return list.map(([s, value]) => ([s * 1000, value]))
  }

  // 通过设置的步长给未返回数据的时间段填充null值，优化图表展示
  const ret = []
  list.forEach((item) => {
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

export const getTimeseriseLineSeriesData = (dataResults) => {
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
        smooth: true,
        ...target.chartOptions,
        name: getLegendText(target.legendFormat, item.metric),
        data: formatTimeseriseLineStepData(d, target.step),
        connectNulls: false
      }
    })
    return ret.concat(data)
  }, [])
}