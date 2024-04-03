import { get, groupBy, isEmpty } from 'lodash'
import { QUOTA_TYPE, QUOTA_THRESHOLD } from '@/constant/quota'

import {
  GREEN_COLOR,
  WARNING_COLOR,
  DANGER_COLOR,
  QUOTA_GRAY
} from '@/constant/color'

export const getProportionColor = (num = 0) => {
  const lowNum = QUOTA_THRESHOLD.LOW
  const mediumNum = QUOTA_THRESHOLD.MEDIUM
  let ret = QUOTA_GRAY // num = 0
  if (num > 0 && num <= lowNum) ret = GREEN_COLOR
  if (num > lowNum && num <= mediumNum) ret = WARNING_COLOR
  if (num > mediumNum) ret = DANGER_COLOR
  return ret
}

export const parseQuotaList = (data = []) => {
  const quotaGroups = groupBy(data, 'group')
  const ret = {}
  quotaGroups && Object.keys(quotaGroups).forEach(k => {
    const keyObject = {} // 例：{ cpu: { hard: 2, used: 3 }, disk: { hard: 2, used: 3 }, mem: { hard: 2, used: 3 }}
    k && quotaGroups[k].forEach(item => {
      const obj = {} // 例：{ cpu: { hard: 2, used: 3 } }
      const usedObj = get(item, 'status[0].used') || {}
      const quotaKey = Object.keys(usedObj)[0]
      if (!quotaKey) return

      // set used value
      obj[quotaKey] = { used: usedObj[quotaKey] || '' }

      // set hard value
      const hardObj = get(item, 'status[0].hard') || {}
      Object.assign(obj[quotaKey], { hard: hardObj[quotaKey] || '' })

      // set quota name
      Object.assign(obj[quotaKey], { name: get(item, 'name') || '' })

      // set quota proportion
      let proportion = 0
      const u = usedObj[quotaKey] || 0
      const h = hardObj[quotaKey] || 0
      if (u && h) {
        proportion = parseFloat(Math.ceil(u / h * 10000) / 100) // 向上取整 保留两位小数的百分数 整数忽略
      }
      Object.assign(obj[quotaKey], { proportion })

      Object.assign(keyObject, obj)
    })
    // 例：{ exp: {cpu: { hard: 2, used: 3 }, disk: { hard: 2, used: 3 }, mem: { hard: 2, used: 3 }}, exp2: {cpu: { hard: 2, used: 3 }}}
    if (!isEmpty(keyObject)) ret[k] = keyObject
  })
  return ret
}

export const getMaxProportion = (quota = {}) => { // 得到最大占比
  let maxNum = 0
  const keys = Object.keys(QUOTA_TYPE)
  !isEmpty(quota) && keys.forEach(k => {
    const n = (quota[k] && quota[k].proportion) || 0
    if (n > maxNum) {
      maxNum = n
    }
  })

  return maxNum
}
