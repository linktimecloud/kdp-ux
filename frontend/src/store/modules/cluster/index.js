import { cloneDeep, get, uniqBy, orderBy } from 'lodash'

import i18n from '@/i18n'

import Ajax from '@/api/ajax'

import * as types from '@/store/types'

// namespaces
const namespaced = true

// initial state
const state = {
  clusterDetail: null,
  clusterLicense: null,
  catalogTypesData: []
}

// getters
const getters = {
  clusterDetail (state) {
    return cloneDeep(state.clusterDetail)
  },
  clusterLicense (state) {
    return cloneDeep(state.clusterLicense)
  },
  gitAdminSwitch (state, getters) {
    return get(getters.clusterDetail, 'gitAdminSwitch')
  },
  catalogTypesData (state, getters) {
    return cloneDeep(state.catalogTypesData)
  },
  catalogTypeList (state, getters) {
    const list = getters.catalogTypesData || []
    let ret = list.map(item => ({
      value: item.category,
      label: item.category,
      description: item.description
    }))
    ret = ret.concat([{ value: 'other', label: i18n.t('common.other') }])
    ret = uniqBy(ret, 'label')
    ret = orderBy(ret, ['label'], ['desc'])
    return ret
  }
}

// actions
const httpRes = {}
const actions = {
  getClusterDetail ({ commit }) {
    httpRes.getClusterDetail && httpRes.getClusterDetail.cancel()
    httpRes.getClusterDetail = new Ajax({
      resource: 'GET_CLUSTER',
      success (rsp = {}) {
        commit(types.GET_CLUSTER_DETAIL, { data: rsp.data })
      },
      loading: true
    })
    return httpRes.getClusterDetail.fetch().then(rsp => rsp.data)
  },
  getCatalogTypes ({ commit }) {
    new Ajax({
      resource: 'GET_CATALOGS',
      success (rsp = {}) {
        const ret = rsp.data || {}
        commit(types.GET_CATALOG_TYPES, { data: ret })
      },
      loading: true
    }).fetch()
  }
}

// mutations
const mutations = {
  [types.GET_CLUSTER_DETAIL] (state, { data }) {
    state.clusterDetail = data
  },
  [types.GET_CLUSTER_LICENSE] (state, { data }) {
    state.clusterLicense = data
  },
  [types.GET_CATALOG_TYPES] (state, { data }) {
    state.catalogTypesData = data
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
