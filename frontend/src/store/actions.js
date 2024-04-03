import Ajax from '@/api/ajax'
import { get } from 'lodash'
import { SUPPORTED_LANG_LIST } from '@/constant'
import { DEFAULT_LANG } from '@/env'

import * as types from './types'

export const removeCurrentUser = ({ commit }) => {
  commit(types.SET_CURRENT_USER, { data: null })
}

export const setLayoutType = ({ commit }, type) => {
  commit(types.SET_LAYOUT_TYPE, { type })
}

export const setLayoutCollapse = ({ commit }, bool) => {
  commit(types.SET_LAYOUT_COLLAPSE, { bool })
}

export const setProcesses = ({ commit }, data = {}) => {
  commit(types.SET_PROCESSES, { data })
}

export const setLang = ({ commit }, lang) => {
  const supportedLangs = SUPPORTED_LANG_LIST()
  const newLang = supportedLangs.find(item => item.lang === lang) ? lang : DEFAULT_LANG

  commit(types.SET_LANG, { lang: newLang })
}

export const setLoadingOptions = ({ commit }, { text, closable, show }) => {
  commit(types.SET_LOADING_OPTIONS, { text, closable, show })
}

export const setCurrentUser = ({ commit, state, getters }, loading = true) => {
  return new Ajax({
    resource: 'GET_USER',
    success (rsp) {
      const data = rsp.data
      commit(types.SET_CURRENT_USER, { data })
    },
    loading
  }).fetch().then(rsp => rsp.data)
}

export const setCurrentBdc = ({ commit, state, getters }, loading = true) => {
  return new Ajax({
    resource: 'GET_BDCS',
    success (rsp) {
      const data = get(rsp, 'data[0]') || {}
      commit(types.SET_CURRENT_BDC_NAME, { data })
    },
    loading
  }).fetch().then(rsp => rsp.data)
}

export const setManualList = ({ commit, getters }) => {
  const enabled = get(getters, 'customizeEnv.features.MANUAL')
  return enabled
    ? new Ajax({
      resource: 'GET_MANUALS',
      success (rsp = {}) {
        const { base, list } = rsp.data || {}
        commit(types.SET_MANUAL_DATA, { base, list })
      }
    }).fetch().then(rsp => rsp.data)
    : () => null
}

export const behaviorUpdate = ({ getters }, data = {}) => {
  const { currentUser } = getters
  const { type, to = {}, from = {}, name = '', path = '' } = data

  const base = window.location.origin

  const reqData = { type }

  if (type === 'path') {
    reqData.name = to.name
    reqData.refer = `${base}/#${from.fullPath}`
    reqData.path = `${base}/#${to.fullPath}`
  } else if (type === 'action') {
    reqData.name = name
    reqData.path = path
  } else if (type === 'toast') {
    const { toastType = 'warning', page, resource, feature, message } = data
    reqData.toastType = toastType
    reqData.page = page
    reqData.resource = resource
    reqData.feature = feature
    reqData.message = message
    reqData.url = window.location.href

    const { currentUser } = getters
    reqData.user = currentUser && currentUser.userName
  }

  return currentUser
    ? new Ajax({
      data: { reqData },
      resource: 'POST_BEHAVIOR'
    }).fetch().then(rsp => rsp.data)
    : () => null
}

export const setTipsCache = ({ commit }, data) => {
  commit(types.SET_TIPS_CACHE, { data })
}
