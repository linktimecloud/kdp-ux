import * as types from '../types'

export default {
  [types.POST_BEHAVIOR]: () => ({
    method: 'post',
    path: 'behavior'
  })
}
