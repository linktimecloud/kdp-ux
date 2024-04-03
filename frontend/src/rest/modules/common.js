import * as types from '../types'

export default {
  [types.GET_TUTORIAL_TIPS]: () => ({
    method: 'get',
    path: 'tutorial/tips'
  }),
  [types.GET_USER]: () => ({
    method: 'get',
    path: 'user'
  })
}
