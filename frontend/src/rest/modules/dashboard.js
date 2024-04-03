import * as types from '../types'

export default {
  [types.POST_DASHBOARD_LABELS]: () => ({
    method: 'post',
    path: 'dashboard/labels'
  }),
  [types.GET_DASHBOARD_CONFIG]: () => ({
    method: 'get',
    path: 'dashboard/config'
  }),
  [types.POST_DASHBOARD_QUERY]: () => ({
    method: 'post',
    path: 'dashboard/query'
  }),
  [types.POST_DASHBOARD_QUERY_RANGE]: () => ({
    method: 'post',
    path: 'dashboard/queryrange'
  })
}
