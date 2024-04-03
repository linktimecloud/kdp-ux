import { capitalize, isNil } from 'lodash'

import i18n from '@/i18n'
import { STATUS_MAPPER, PUBLISH_STATUS, ENABLE_STATUS } from '@/constant'

import { transMenuName } from '@/utils/transname'

import { strip, addDays, strMonth, strDay, strHours, strTime, strSeconds, strFull, validDate, getLabelformat } from './utils'
import { priorityToName } from './priorty'

export default {
  install (Vue, options) {
    Vue.filter('capitalize', val => {
      return capitalize(val)
    })
    Vue.filter('uppercase', val => {
      return val.toUpperCase()
    })
    Vue.filter('lowercase', val => {
      return val.toLowerCase()
    })
    Vue.filter('json', (val = {}) => {
      val = JSON.stringify(val, null, '\t')
      return val
    })
    Vue.filter('strip', (val = '') => {
      if (val) {
        val = strip(val.trim())
      }
      return val
    })
    Vue.filter('holder', (val = '', holder = '') => {
      if (!val && val !== 0) {
        val = holder
      }
      return val
    })
    Vue.filter('append', (val = '', after = '', sep = '') => {
      return val + sep + after
    })
    Vue.filter('prepend', (val = '', before = '', sep = '') => {
      return before + sep + val
    })
    Vue.filter('slice', (val = [], length = 10) => {
      if (val.slice) {
        val = val.slice(0, length)
      }
      return val
    })
    Vue.filter('timeformat', (time, type = 'full', add) => {
      let ret = ''
      if (time) {
        if (typeof time === 'string' && !validDate(time)) {
          time = parseInt(time) || Date.now()
        }
        if (add !== undefined) {
          time = addDays(time, add)
        }
        switch (type) {
          case 'month':
            ret = strMonth(time)
            break
          case 'day':
            ret = strDay(time)
            break
          case 'time':
            ret = strTime(time)
            break
          case 'hour':
            ret = strHours(time)
            break
          case 'second':
            ret = strSeconds(time)
            break
          default:
            ret = strFull(time)
        }
      }
      return ret
    })
    Vue.filter('boolformat', (bool) => {
      return bool ? '是' : '否'
    })
    Vue.filter('priorityToText', (priority) => {
      const p = priorityToName(priority)
      return i18n.t(`tickets.${p}`)
    })
    Vue.filter('statusToText', (step) => {
      let s = ''
      switch (step) {
        case 1:
          s = 'ticketTodo'
          break
        case 2:
          s = 'ticketProcessing'
          break
        case 3:
          s = 'ticketSolved'
          break
        case 4:
          s = 'ticketClosed'
          break
        default:
          s = 'ticketTodo'
      }
      return i18n.t(`tickets.${s}`)
    })
    // text => slice
    Vue.filter('statusTextSlice', (step) => {
      return step.slice(2)
    })
    Vue.filter('processStatus', (s = 0) => {
      return i18n.t(`common.${STATUS_MAPPER()[s]}`)
    })
    Vue.filter('publishStatus', (s = 0) => {
      return i18n.t(`courses.${PUBLISH_STATUS()[s]}`)
    })
    Vue.filter('enableStatus', (s = 0) => {
      return i18n.t(`common.${ENABLE_STATUS()[s]}`)
    })
    Vue.filter('menuName', (name = '') => {
      return transMenuName(name)
    })
    Vue.filter('noData', (val) => {
      if (isNil(val) || val === '') {
        return i18n.t('common.nodata')
      }
      return val
    })
    Vue.filter('constant', (val) => {
      if (isNil(val) || val === '') {
        return ''
      }
      if (typeof val !== 'string') {
        return val
      }
      return i18n.t(`constant.${val.toLowerCase()}`)
    })
    Vue.filter('queueNum', (val) => {
      if (isNil(val)) {
        return i18n.t('job.noQueueInfoAvialable')
      }
      return val
    })
    Vue.filter('labelformat', (val) => {
      return getLabelformat(val)
    })
  }
}
