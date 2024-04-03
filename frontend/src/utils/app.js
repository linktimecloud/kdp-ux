import i18n from '@/i18n'
import { isEmpty, get, cloneDeep, has, toNumber, toInteger, isNil } from 'lodash'
import Store from '@/store'
import moment from 'moment'

import { formatCapacityValue } from '@/utils/cluster/utils'
import { formatPercentage } from '@/utils/utils'
import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'
import { SYSTEM_APPLICATION_STATUS } from '@/constant/application'

export const getAppStatusText = (data = {}) => {
  if (isEmpty(data)) return ''
  const status = data.status && data.status.split('(')[0]
  const statusText = (status && i18n.t(`applications.${status}`)) || ''
  return `${statusText}`
}

export const getAppActionPermisson = (gname, appName) => {
  const { isAdmin, currentUser } = Store.getters

  // 先验证是否为当前用户的个人应用
  const userName = currentUser && currentUser.userName
  const regex = new RegExp(`^u-${userName}-.+|^${gname}-u-${userName}-.+`)
  if (regex.test(appName)) return true

  // 再验证是否为系统管理员或者组织管理员
  const groups = get(currentUser, 'groups') || []
  const orgRoles = get(groups.find(item => item.name === gname), 'roles') || []
  return isAdmin || orgRoles.find(item => ['1', '9'].includes(item.id))
}

export const getExportCsvDataFromAppList = ({ list = [], columns = [], type = 'pod', bdcList = [] } = {}) => {
  const getBdcText = (item) => {
    const bdcInfo = bdcList.find(b => b.label === item.bdc) || {}
    const currentStatus = !bdcInfo?.isHealth ? 'InActive' : bdcInfo?.status
    const statusText = get((BIG_DATA_CLUSTER_STATUS()).find(s => s.value === currentStatus), 'label')
    return item.bdc ? `${item.bdc}(${statusText})` : i18n.t('common.noData')
  }

  const data = []
  const typeMap = {
    pod: {
      cpu: item => getUsedRequestLimitText(item, ['cpuUsed', 'cpuRequest', 'cpuLimit'], 'cpu'),
      memory: item => getUsedRequestLimitText(item, ['memUsed', 'memRequest', 'memLimit'], 'mem'),
      status: item => i18n.te(`applications.podStatusLabel.${item.status}`) ? i18n.t(`applications.podStatusLabel.${item.status}`) : i18n.t('cluster.unknown'),
      containers: item => item.containerStatuses.map(c => c.name).join(),
      bdc: item => getBdcText(item)
    },
    workload: {
      cpu: item => getUsedRequestLimitText(item, ['cpuUsed', 'cpuRequest', 'cpuLimit'], 'cpu'),
      memory: item => getUsedRequestLimitText(item, ['memUsed', 'memRequest', 'memLimit'], 'mem'),
      podsSort: item => item.pods,
      status: item => i18n.te(`applications.runtimeStatus.${item.status}`) ? i18n.t(`applications.runtimeStatus.${item.status}`) : i18n.t('cluster.unknown'),
      bdc: item => getBdcText(item)
    },
    application: {
      status: item => get(SYSTEM_APPLICATION_STATUS().find(s => s.value === item.status), 'label') || i18n.t('cluster.unknown'),
      containers: item => item.containerStatuses.map(c => c.name).join(),
      bdc: item => getBdcText(item),
      updateTime: item => moment(item.updateTime).format('yyyy-MM-DD HH:mm:ss')
    }
  }

  const propTransformMap = typeMap[type] || {}

  list.forEach(item => {
    const obj = {}
    columns.filter(c => c.prop !== 'operate').forEach(({ prop, label }) => {
      const value = propTransformMap[prop] ? propTransformMap[prop](item) : item[prop]
      obj[label] = isNil(value) || !value.toString() ? i18n.t('common.noData') : value
    })
    data.push(obj)
  })

  return data
}

export const getUsedRequestLimitText = (item, keys, type) => {
  return keys.reduce((ret, key) => {
    const split = ret ? ' / ' : ''
    const percentage = key.includes('Used') ? '' : `(${formatPercentage(item[`${key}Rate`])})`
    ret += `${split}${formatCapacityValue(type, item[key])} ${percentage}`
    return ret
  }, '')
}

export const formatAppSetting = (settings = {}) => {
  const reqData = cloneDeep(settings)
  if (has(settings, 'app-cpus')) {
    const cpu = get(settings, 'app-cpus')
    const c = cpu.toString().split('.')[1]
    if (c && c.length > 3) reqData['app-cpus'] = toNumber(toNumber(cpu).toFixed(3))
  }
  if (has(settings, 'app-instances')) {
    const instance = get(settings, 'app-instances')
    reqData['app-instances'] = toInteger(instance)
  }

  if (has(settings, 'ports')) {
    const ports = get(settings, 'ports')
    reqData.ports = ports.filter(item => item.containerPort)
  }

  if (has(settings, 'volumes')) {
    const volumes = get(settings, 'volumes')
    reqData.volumes = volumes.filter(item => item.containerPath)
  }

  if (has(settings, 'env')) {
    const env = get(settings, 'env')
    reqData.env = env.filter(item => item.key)
  }

  if (has(settings, 'labels')) {
    const labels = get(settings, 'labels')
    reqData.labels = labels.filter(item => item.key)
  }

  const ports = reqData.ports || []
  reqData.ingress_enabled = ports.some(p => p['load-balance'])
  reqData.monitor_enabled = ports.some(p => p['is-monitoring'])

  return reqData
}
