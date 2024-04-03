import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from './logger'

import state from './state'
import mutations from './mutations'

import * as actions from './actions'
import * as getters from './getters'

import modules from './modules'

import { NODE_ENV } from '@/env'
const debug = NODE_ENV !== 'production' && NODE_ENV !== 'testing'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
