import { isFunction, isPlainObject } from 'lodash'

import Store from '@/store'
import { REST } from '@/rest'

export const rest = res => {
  let name = res
  let sets
  let obj
  if (isPlainObject(res)) {
    name = res.name
    sets = res.sets
  }
  if (isFunction(REST[name])) {
    obj = REST[name](sets)
  }
  const restList = Store.getters.restList
  const permission = {
    allow: !restList.includes(name)
  }

  return { permission, name, sets, obj }
}
