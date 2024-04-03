import { cloneDeep, get } from 'lodash'

import MENU from '@/menu'

import { getDisabledMenuList } from '@/common/sidebar/utils'

export const env = (state) => {
  return cloneDeep(state.env)
}

export const ws = (state) => {
  return cloneDeep(state.ws)
}

export const route = (state) => {
  return cloneDeep(state.route)
}

export const processes = (state) => {
  return cloneDeep(state.processes || {
    list: []
  })
}

export const lang = (state) => {
  return state.lang
}

export const oem = (state, getters, rootState) => {
  return cloneDeep(get(rootState, 'moduleCluster.clusterLicense.env.OEM_SETTINGS'))
}

export const company = (state, getters, rootState) => {
  return get(rootState, 'moduleCluster.clusterLicense.version_type') || ''
}

export const customizeEnv = (state) => {
  return cloneDeep(state.customizeEnv)
}

export const layoutType = (state) => {
  let ret = state.layoutType
  if (!state.layoutTypes.includes(ret)) {
    ret = 'plain'
  }
  return ret
}

export const navbarType = (state) => {
  return state.navbarType || ''
}

export const layoutCollapse = (state) => {
  return !!state.layoutCollapse
}

export const currentUser = (state, getters) => {
  return cloneDeep(state.currentUser)
}

export const currentBdcName = (state, getters) => {
  return state.currentBdcInfo?.name || ''
}

export const currentBdcNS = (state, getters) => {
  return state.currentBdcInfo?.defaultNS || ''
}

// 判断当前用户是否存在机构，并且在机构中拥有admin或者develop角色
export const isOrgRole = (state, getters) => {
  return true
}

// 判断当前用户是否存在机构，并且在机构中拥有admin角色
export const isOrgAdmin = (state, getters) => {
  return true
}

export const userOrgName = (state, getters) => {
  const groups = get(getters, 'currentUser.groups') || []
  return get(groups.find(item => item.type === 'organization'), 'name') || ''
}

export const userOrg = (state, getters) => {
  const groups = get(getters, 'currentUser.groups') || []
  return groups.find(item => item.type === 'organization') || {}
}

export const userPermissions = (state) => {
  return cloneDeep(state.userPermissions)
}

export const systemHealthy = (state) => {
  return cloneDeep(state.systemHealthy)
}

export const userAvatar = (state, getters) => {
  return cloneDeep(state.userAvatar)
}

export const disabledMenuList = (state, getters) => {
  const { isAdmin, isRoot, isOrgRole, isOrgAdmin } = getters
  const list = getDisabledMenuList({ list: MENU, isAdmin: isAdmin || isRoot, isOrgRole, isOrgAdmin }) || []

  if (!isAdmin && !isRoot) {
    list.push('permission')
  }

  return list
}

export const menuSubList = (state, getters) => {
  return MENU
    .reduce((total, cur) => {
      const { sub } = cur

      if (sub && sub.length) {
        total = total.concat(sub.map(item => item.name))
      } else {
        total.push(cur.name)
      }
      return total
    }, [])
    .filter(name => !getters.disabledMenuList.includes(name))
}

export const entry = (state, getters) => {
  const ret = get(getters, 'customizeEnv.home') || ''
  const list = get(getters, 'menuSubList') || []
  return list.includes(ret) ? ret : list[0]
}

export const restList = (state, getters) => {
  return get(getters, 'userPermissions.rest') || []
}

export const manualList = (state) => {
  return cloneDeep(state.manualList) || []
}

export const manualBase = (state, getters) => {
  return getters.env.MANUAL_BASE
}

export const loadingOptions = (state) => {
  return cloneDeep(state.loadingOptions)
}

export const isDev = (state) => {
  return cloneDeep(state.isDev)
}

export const isAdmin = (state) => {
  return cloneDeep(state.isAdmin)
}

export const isRoot = (state) => {
  return cloneDeep(state.isRoot)
}

export const isReadyCustomize = (state) => {
  return true
}

export const tipsCache = (state) => {
  return cloneDeep(state.tipsCache)
}
