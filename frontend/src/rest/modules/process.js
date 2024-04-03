import * as types from '../types'

export default {
  [types.GET_PROCESSES]: () => ({
    method: 'get',
    path: 'processes'
  }),
  [types.GET_PROCESSES_PID]: ({ pid }) => ({
    method: 'get',
    path: `processes/${pid}`
  })
}
