import Vue from 'vue'
import moment from 'moment'
import i18n from '@/i18n'
import Store from '@/store'

import { round, toNumber, partition, isNil, orderBy, get } from 'lodash'

moment.locale('zh', {
  invalidDate: '',
  months: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ]
})

moment.locale(Vue.config.lang)

// const LOCATION_HREF = window.location
const THIS_YEAR = moment().year()
/**
 * Remove all html tags
 *
 * @param {string} [str='']
 * @returns {String}
 */
export const strip = (str = '') => {
  if (str) {
    str = str.replace(/<\/?[^>]+(>|$)/g, '')
  }
  return str
}

/**
 * clear value of a input[type="file"]
 *
 * @param {DOM} f
 */
export const clearFile = (f) => {
  if (f.value) {
    try {
      // for IE11, latest Chrome/Firefox/Opera...
      f.value = ''
      // for IE9 ~ IE10
      if (f.value) {
        f.type = 'text'
        f.type = 'file'
      }
    } catch (err) {
      console.warn('Reset the input file element fault.')
    }
    if (f.value) {
      // for IE5 ~ IE8
      const form = document.createElement('form')
      const parentNode = f.parentNode
      const ref = f.nextSibling
      form.appendChild(f)
      form.reset()
      parentNode.insertBefore(f, ref)
    }
  }
}

/**
 * compute the time after {add} days
 *
 * @param {timestamp} [time=Date.now()]
 * @param {number} [add=0]
 * @param {boolean} [end=false] whether the end of day
 * @returns {timestamp}
 */
export const addDays = /* istanbul ignore next */ (time = Date.now(), add = 0, end = false) => {
  let ret = moment(time).add(add, 'd')
  if (end) {
    ret = ret.endOf('day')
  }
  return +ret
}

/**
 * warp momentjs to some useful functions
 */
export const validDate = /* istanbul ignore next */ (time = Date.now()) => {
  return moment(time).isValid()
}

export const strSeconds = /* istanbul ignore next */ (time = Date.now(), sep = ':') => {
  const date = moment(time)
  const ret = date.format(`HH${sep}mm${sep}ss`)
  return ret
}
export const strHours = /* istanbul ignore next */ (time = Date.now(), sepDay = '-', sep = ':') => {
  const date = moment(time)
  const ret = date.format(`MM${sepDay}DD HH${sep}mm`)
  return ret
}
export const strDay = /* istanbul ignore next */ (time = Date.now(), sep = '-') => {
  const date = moment(time)
  const ret = date.format(`YYYY${sep}MM${sep}DD`)
  return ret
}
export const strMonth = /* istanbul ignore next */ (time = Date.now(), sep = '-') => {
  const date = moment(time)
  const ret = date.format(`YYYY${sep}MM`)
  return ret
}
export const strFull = /* istanbul ignore next */ (time = Date.now(), sepDay = '-', sepTime = ':', sep = ' ') => {
  if (time === '') {
    return ''
  }
  const date = moment(time)
  const ret = date.format(`YYYY${sepDay}MM${sepDay}DD${sep}HH${sepTime}mm${sepTime}ss`)
  return ret
}
export const strTime = /* istanbul ignore next */ (time = Date.now(), sepTime = ':', sep = ' ') => {
  const self = this
  const date = moment(time)
  let ret = self.strDay(date)
  if (date.year() >= THIS_YEAR) {
    ret = self.strFull(date)
  }
  return ret
}

export const getUrlQuery = /* istanbul ignore next */ url => {
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

export const getLabelformat = (label) => {
  const l = Store.getters.lang
  const lang = l === 'zh' ? 'cn' : l
  let ret = label
  if (ret && typeof ret === 'object') {
    ret = ret[lang]
  }
  return ret
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
