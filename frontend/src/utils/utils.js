import moment from 'moment'
import i18n from '@/i18n'
import { useClipboard } from '@vueuse/core'
import { ElNotification } from 'element-plus'

import { round, toNumber, partition, isNil, orderBy, get, isFunction } from 'lodash'

export const timeformat = (time = Date.now(), format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return ''
  return moment(time).format(format)
}

export const getUrlQuery = url => {
  const querys = (url.split('?')[1] && url.split('?')[1].split('&')) || []
  return querys.reduce((ret, cur) => {
    ret[cur.split('=')[0]] = cur.split('=')[1]
    return ret
  }, {})
}

export const formatDurationTime = (total = 0, startUnit = 'second') => {
  total = total * 1 || 0
  const date = moment.duration(total, `${startUnit}s`)

  const unitList = [
    { unit: i18n.t('common.year'), value: date.asYears() },
    { unit: i18n.t('common.month'), value: date.asMonths() },
    { unit: i18n.t('common.week'), value: date.asWeeks() },
    { unit: i18n.t('common.day'), value: date.asDays() },
    { unit: i18n.t('common.hour'), value: date.asHours() },
    { unit: i18n.t('common.minute'), value: date.asMinutes() },
    { unit: i18n.t('common.second'), value: date.asSeconds() }
  ]

  const { value, unit } = unitList.find(item => Math.abs(item.value) >= 1) || unitList[unitList.length - 1]
  return (Number.isInteger(value) ? value : value.toFixed(1)) + ' ' + unit
}

export const beautifyDataUnit = ({ data, startUnit = 'Byte', decimalDigits = 1, needBlankSpace = true, micrometer = false }) => {
  if (!data) return ''
  const unitList = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB']
  let ret = data
  let i = unitList.indexOf(startUnit) > 0 ? unitList.indexOf(startUnit) : 0
  while (ret > 1024 && i < unitList.length - 1) {
    ret = ret / 1024
    i++
  }
  let num = (Number.isInteger(ret) ? ret : ret.toFixed(decimalDigits))
  if (micrometer) {
    num = num.toLocaleString()
  }
  return `${num}${(needBlankSpace ? ' ' : '')}${unitList[i]}`
}

/**
 * input: { a: { b: { c: 123 }, d: 456 }, e: 789 }
 * output: { 'a.b.c': 123, 'a.d': 456, e: 789 }
 */
export const flattenObj = (obj, omitKey) => {
  const result = {}
  for (const i in obj) {
    if ((typeof obj[i]) === 'object' && !Array.isArray(obj[i])) {
      const temp = flattenObj(obj[i], omitKey)
      for (const j in temp) {
        const key = j === omitKey ? i : `${i}.${j}`
        result[key] = temp[j]
      }
    } else {
      result[i] = obj[i]
    }
  }
  return result
}

export const formatPercentage = (val, decimalDigits = 1) => {
  const percentage = round(val * 100, decimalDigits)
  return percentage ? `${percentage}%` : '0'
}

export const getPercentage = (val, total) => {
  const t = toNumber(total) || 0
  const v = toNumber(val) || 0
  if (t === 0) return 0

  return v / t
}

export const sortListWithoutNull = ({ list = [], prop = '', subProp = '', order = 'desc' }) => {
  const [unSortable, sortable] = partition(list, o => isNil(subProp ? get(o, `${prop}.${subProp}`) : get(o, prop)))
  let ret = []
  if (subProp) {
    ret = orderBy(sortable, item => get(item[prop] || {}, subProp), order)
  } else {
    ret = orderBy(sortable, prop, order)
  }
  return ret
    .concat(unSortable)
}

export const filterTableList = ({ list, filter = {}, order = 'asc', orderBy, compareFuncs = {} }) => {
  // Step-1: 通过筛选项进行过滤
  let ret = list.filter(item => {
    return Object.keys(filter).every(key => {
      if (!filter[key]) return true
      const filterValue = (filter[key] && filter[key]?.toString().toLowerCase())
      const itemValue = (item[key] && item[key]?.toString().toLowerCase())

      if (isFunction(compareFuncs[key])) {
        return compareFuncs[key](itemValue, filterValue, key)
      } else {
        return itemValue === filterValue
      }
    })
  })

  // Step-2: 排序
  if (orderBy) {
    ret = sortListWithoutNull({ list: ret, prop: orderBy, order })
  }

  return ret
}

export const copyToClipboard = ({ content = '', isShowMessage = true }) => {
  if (!content) return
  const { copy } = useClipboard()
  copy(content)
  if (isShowMessage) {
    ElNotification({
      type: 'success',
      message: i18n.t('common.copySuccess')
    })
  }
}