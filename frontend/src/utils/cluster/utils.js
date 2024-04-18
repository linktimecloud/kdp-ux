import i18n from '@/i18n'
import { get, isNil, set, toNumber, map, orderBy } from 'lodash'

import {
  GREEN_COLOR,
  QUOTA_GRAY,
  DANGER_COLOR,
  INFO_COLOR,
  WARNING_COLOR
} from '@/constant/color'
import { MASTER_NODES_TYPE } from '@/constant/cluster'

import PATTERNS from '@/utils/patterns'
import { beautifyDataUnit, formatPercentage } from '@/utils/utils'
import { formatDecimal } from '@/common/dashboard/utils.js'

import { getBdcListAPI } from '@/api/bdc'

export const getNodesStatusValueObj = (key, value) => {
  const ret = {
    valueText: '',
    color: ''
  }
  if (key === 'Ready') {
    switch (value) {
      case 'True':
        ret.valueText = i18n.t('cluster.nodeHealth')
        ret.color = GREEN_COLOR
        break
      case 'False':
        ret.valueText = i18n.t('cluster.nodeUnhealth')
        ret.color = DANGER_COLOR
        break
      default:
        ret.valueText = i18n.t('cluster.unknown')
        ret.color = QUOTA_GRAY
        break
    }
  } else if (key === 'NetworkUnavailable') {
    switch (value) {
      case 'True':
        ret.valueText = i18n.t('cluster.false')
        ret.color = DANGER_COLOR
        break
      case 'False':
        ret.valueText = i18n.t('cluster.true')
        ret.color = GREEN_COLOR
        break
      default:
        ret.valueText = i18n.t('cluster.unknown')
        ret.color = QUOTA_GRAY
        break
    }
  } else if (key === 'SchedulingDisabled') {
    switch (value) {
      case 'True':
        ret.valueText = i18n.t('common.stop')
        ret.color = QUOTA_GRAY
        break
      case 'False':
        ret.valueText = i18n.t('common.on')
        ret.color = GREEN_COLOR
        break
      default:
        ret.valueText = i18n.t('cluster.unknown')
        ret.color = QUOTA_GRAY
        break
    }
  } else {
    switch (value) {
      case 'True':
        ret.valueText = i18n.t('cluster.large')
        ret.color = DANGER_COLOR
        break
      case 'False':
        ret.valueText = i18n.t('cluster.small')
        ret.color = GREEN_COLOR
        break
      default:
        ret.valueText = i18n.t('cluster.unknown')
        ret.color = QUOTA_GRAY
        break
    }
  }
  return ret
}

export const getNodesResourceColor = (type) => {
  let ret = ''
  switch (type) {
    case 'cpu':
      ret = INFO_COLOR
      break
    case 'mem':
      ret = GREEN_COLOR
      break
    case 'disk':
      ret = WARNING_COLOR
      break
    default:
      ret = QUOTA_GRAY
      break
  }
  return ret
}

export const getNodesLabelValid = ({ type, item, isUniqKey, sign = 'node' }) => {
  const { key, value } = item
  let ret = ''
  if (type === 'key') {
    const keyRegMap = {
      node: 'nodes_key',
      bdc: 'bdc_key',
      docker: 'docker_key'
    }
    const keyReg = PATTERNS[keyRegMap[sign]]
    if (!key && !value) return ''
    if (key && !isUniqKey) ret = i18n.t('cluster.labelNotUniq')
    if (!keyReg.test(key)) ret = `${i18n.t('cluster.labelKey')}${i18n.t('cluster.inValid')}`
    if (!key && value) ret = `${i18n.t('cluster.labelKey')}${i18n.t('pass.noEmpty')}`
  } else {
    const valueRegMap = {
      node: 'nodes_value',
      bdc: 'nodes_value',
      docker: 'docker_value'
    }
    const valueReg = PATTERNS[valueRegMap[sign]]
    if (value && !valueReg.test(value)) ret = `${i18n.t('cluster.labelValue')}${i18n.t('cluster.inValid')}`
  }
  return ret
}

export const formatCapacityValue = (type, value = 0, status) => {
  if (status === 'notRunning') {
    return '-'
  }

  if (value <= 0 || typeof value !== 'number') {
    return 0
  }
  if (type === 'cpu') {
    const num = formatDecimal(value)
    return num + i18n.t('applications.core')
  } else {
    return beautifyDataUnit({ data: value, decimalDigits: 2, needBlankSpace: true, micrometer: true })
  }
}

export const getExportCsvDataFromNodeList = ({ list = [], columns = [] } = {}) => {
  const data = []
  const propTransformMap = {
    name: item => `${item.name}(${item.ip})`,
    diskSort: item => formatCapacityValue('disk', item.capacity_usage.capacity_storage_total),
    cpuSort: item => getUsedRequestLimitText(item, ['cpuUsed', 'cpuRequest', 'cpuLimit'], 'cpu'),
    memSort: item => getUsedRequestLimitText(item, ['memUsed', 'memRequest', 'memLimit'], 'mem'),
    settings: item => `${formatCapacityValue('cpu', item.capacity_usage.capacity_cpu_total)} / ${formatCapacityValue('mem', item.capacity_usage.capacity_mem_total)}`,
    allocatable: item => `${formatCapacityValue('cpu', item.cpuAllocatableTotal)} / ${formatCapacityValue('mem', item.memAllocatableTotal)}`,
    typeSort: item => getStatusText(item),
    labels: item => {
      const labelArr = map(item.labels, (value, key) => ({ key, value }))
      const labelRet = labelArr.map(obj => {
        return obj.value ? `${obj.key}:${obj.value}` : `${obj.key}`
      })
      return (labelRet || []).join()
    }
  }

  list.forEach(item => {
    const obj = {}
    columns.filter(c => c.prop !== 'operate').forEach(({ prop, label, subLabel, downloadKey }) => {
      const l = `${label}${subLabel || ''}`
      const value = propTransformMap[prop] ? propTransformMap[prop](item) : item[downloadKey || prop]
      obj[l] = isNil(value) || !value.toString() ? i18n.t('common.noData') : value
    })
    data.push(obj)
  })

  return data
}

export const getUsedRequestLimitText = (item, keys, type) => {
  return keys.reduce((ret, key) => {
    const split = ret ? ' / ' : ''
    ret += `${split}${formatCapacityValue(type, item[key])} (${formatPercentage(item[`${key}Rate`])})`
    return ret
  }, '')
}

export const getStatusText = (item) => {
  const statusObj = (item.status || []).reduce((ret, cur) => {
    return {
      ...ret,
      ...cur
    }
  }, {})

  const statusText = Object.keys(statusObj).reduce((ret, key) => {
    const split = ret ? ' ; ' : ''
    ret += `${split}${i18n.t(`cluster.${key}`)}: ${get(getNodesStatusValueObj(key, statusObj[key]), 'valueText')}`
    return ret
  }, '')

  const typeText = item.type.includes(MASTER_NODES_TYPE) ? i18n.t('cluster.masterNode') : i18n.t('cluster.workerNode')
  return `${typeText}: ${statusText}`
}

export const getPrimaryValue = ({ columns = [], itemData = {} } = {}) => {
  // 获取每一项主键列的值(类似每一项的ID，唯一值), 一定是在每一项的metric里面
  return columns.reduce((ret, cur) => {
    if (cur.primary) {
      ret += ret ? `_${itemData[cur.key]}` : itemData[cur.key]
    }
    return ret
  }, '')
}

export const formatPrometheusTableData = ({ dataResults = [], columns = [] } = {}) => {
  const ret = {}

  dataResults.forEach(data => {
    const { refId, result = [] } = data
    const curColumn = columns.find(item => item.key === refId) || {}
    const isShowNumber = curColumn.layout === 'progressBar' || curColumn.format === 'percent'

    const { dependPrimary } = curColumn

    result.forEach(item => {
      const { metric, value } = item

      let dependMetric = {}
      if (dependPrimary) {
        dependMetric = get(dataResults[0].result.find(d => d.metric[dependPrimary] === metric[dependPrimary]), 'metric') || {}
      }

      const primaryValue = getPrimaryValue({ itemData: { ...metric, ...dependMetric }, columns })
      const curValue = isNaN(toNumber(value[1])) && !isShowNumber ? value[1] : (toNumber(value[1]) || 0)
      set(ret, [`${primaryValue}`], {
        ...(ret[primaryValue] || {}),
        ...metric,
        ...dependMetric,
        [refId]: curValue
      })
    })
  })

  return ret
}

export const getBdcList = (org = '') => {
  return getBdcListAPI().then(rsp => {
    let list = get(rsp, 'data') || []
    if (org) {
      list = list.filter(item => item.orgName === org) || []
    }
    return list.map(item => {
      return {
        label: get(item, 'name'),
        value: get(item, 'name'),
        status: get(item, 'status'),
        namespace: get(item, 'defaultNS'),
        org: get(item, 'orgName')
      }
    })
  })
}

export const getBdcStatusTip = ({ sign = '', status = '', statusText = '' } = {}) => {
  const statusTip = i18n.t(`cluster.${sign}`, { status: statusText })
  const isActiveStatus = status === 'Active'
  return !isActiveStatus ? statusTip : ''
}

export const getBdcOptions = (bdcList = [], group = '') => {
  const list = orderBy(bdcList, 'value').filter(item => item.org === group)
  return [{ label: i18n.t('common.all'), value: '' }].concat(list)
}
