import { orderBy } from 'lodash'
import i18n from '@/i18n'

// namespaces
const namespaced = true

// initial state
const state = {
  orgGroups: [],
  groupOptions: []
}

// getters
const getters = {
  orgGroups (state, getters, rootState) {
    const groups = rootState.currentUser?.groups || []
    return groups.map(item => ({
      ...item,
      value: item.name
    })).filter(item => item.enabled)
  },
  groupOptions (state, getters) {
    const ret = getters.orgGroups.map(item => ({
      value: item.name,
      label: item.name
    }))
    ret.push({ label: i18n.t('common.all'), value: '' })
    return orderBy(ret, 'value')
  }
}

const actions = {}

const mutations = {}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
