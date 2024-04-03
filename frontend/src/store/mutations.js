import { merge } from 'lodash'

import i18n from '@/i18n'

import { Local } from '@/utils/storage'

import * as types from './types'

const mutations = {
  [types.SET_LAYOUT_TYPE] (state, { type }) {
    state.layoutType = type
  },
  [types.SET_LAYOUT_COLLAPSE] (state, { bool }) {
    state.layoutCollapse = bool
  },
  [types.SET_PROCESSES] (state, { data }) {
    state.processes = data
  },
  [types.SET_LANG] (state, { lang }) {
    state.lang = lang
    i18n.locale = lang
    Local.setItem('lang', lang)
  },
  [types.SET_LOADING_OPTIONS] (state, { text, closable, show }) {
    state.loadingOptions = Object.assign({}, state.loadingOptions, {
      text,
      closable,
      show
    })
  },
  [types.SET_CURRENT_USER] (state, { data }) {
    const d = data || {}
    state.isRoot = d.isRoot
    state.isAdmin = d.isAdmin
    state.isDev = d.isDev
    state.currentUser = data
  },
  [types.SET_MANUAL_DATA] (state, { base, list }) {
    state.manualList = list || []
  },
  [types.SET_CURRENT_BDC_NAME] (state, { data }) {
    state.currentBdcInfo = data
  },
  [types.SET_WS] (state, {
    key,
    data = {}
  }) {
    const ws = state.ws || {}
    if (data.type) {
      ws[key] = merge({}, ws[key], { [data.type]: data.data })
      state.ws = Object.assign({}, ws)
    }
  },
  [types.SET_CUSTOMIZE_ENV] (state, { data }) {
    state.customizeEnv = data
  },
  [types.SET_SYSTEM_HEALTHY] (state, { data }) {
    state.systemHealthy = data || false
  },
  [types.SET_USER_AVATAR] (state, { data }) {
    state.userAvatar = data
  },
  [types.SET_TIPS_CACHE] (state, { data }) {
    if (!data) {
      state.tipsCache = data || {}
    } else {
      const { name, content } = data
      state.tipsCache = {
        ...state.tipsCache,
        [name]: content
      }
    }
  }
}

export default mutations
