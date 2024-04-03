import * as types from '../types'

export default {
  [types.GET_CLUSTER]: () => ({
    method: 'get',
    path: 'cluster'
  }),
  [types.POST_CLUSTER]: () => ({
    method: 'post',
    path: 'cluster'
  }),
  [types.GET_CLUSTER_WARS]: () => ({
    method: 'get',
    path: 'cluster/wars'
  }),
  [types.PUT_CLUSTER_STATUS]: () => ({
    method: 'put',
    path: 'cluster/status'
  }),
  [types.GET_CLUSTER_LICENSE]: () => ({
    method: 'get',
    path: 'cluster/license'
  }),
  [types.PUT_CLUSTER_LICENSE]: () => ({
    method: 'put',
    path: 'cluster/license'
  })
}
