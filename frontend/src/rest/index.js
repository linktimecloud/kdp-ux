import { isEmpty, cloneDeep } from 'lodash'

import * as modules from './modules'

let REST = {}
Object.values(modules).forEach(mod => {
  Object.assign(REST, mod)
})

let TYPES = []
Object.keys(modules).forEach(name => {
  const M = modules[name]
  const MOD = { name }
  if (!isEmpty(M)) {
    MOD.sub = Object.keys(M).map(s => ({ name: s }))
  }
  TYPES.push(MOD)
})

REST = cloneDeep(REST)
TYPES = cloneDeep(TYPES)

export { REST, TYPES }
