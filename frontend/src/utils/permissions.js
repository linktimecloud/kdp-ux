import { RULE_SEPARATOR } from '@/constant/settingService'
import { useGlobalStore } from '@/stores/modules/global'

export const getActionPermissions = (prePaths = [], action = 'deny') => {
  const pre = prePaths.join(RULE_SEPARATOR) // 'step__d__400'

  const { userPermissions = {} } = useGlobalStore() || {}
  const resource = userPermissions[action] || []

  const reg = new RegExp(`^${pre}`)
  const ret = resource
    .filter(item => reg.test(item)) // 'step__d__400__d__etl'
    .map(item => item.replace(pre + RULE_SEPARATOR, '')) // 'etl'
  return ret
}

export const checkHasPermissions = (prePaths, key, defaultPermissions = true) => {
  // defaultPermissions: 可以传入一个默认值，决定在没有设置禁用策略下的操作权限
  const isGrant = getActionPermissions(prePaths, 'grant').includes(key)
  const isDeny = getActionPermissions(prePaths).includes(key)

  return (isGrant || defaultPermissions) && !isDeny
}
