import { getActionPermissions, checkHasPermissions } from '@/utils/permissions'

// 在未进行任何权限配置的时候，这几个菜单需要设置默认行为
const getDefaultHiddenList = (isAdmin, isOrgRole, isOrgAdmin) => {
  // 默认隐藏dataops相关的大数据组件： Jira BPAAS-2482
  const defaultHiddenKeys = ['catalogs', 'airbyte', 'automl', 'mlflow', 'superset', 'ddp', 'flowman', 'dataService', 'daam', 'dataQuality', 'labelingSystem']

  if (isAdmin) return [...defaultHiddenKeys]

  if (isOrgAdmin) return [...defaultHiddenKeys, 'roles', 'clusters']

  return [...defaultHiddenKeys, 'groups', 'users', 'oemsettings', 'roles', 'clusters']
}

export const getSidebarMenuList = ({ list = [], isAdmin, isOrgRole, isOrgAdmin } = {}) => {
  const defaultHiddenList = getDefaultHiddenList(isAdmin, isOrgRole, isOrgAdmin)

  const filterMenu = (list, paths) => {
    return list
      .filter(item => {
        const { name } = item
        if (name === 'permission') return isAdmin
        return checkHasPermissions(paths, name, !defaultHiddenList.includes(name))
      })
      .map(item => {
        const { name, disabled, sub } = item
        const isReadonly = getActionPermissions(paths, 'readonly').includes(name)
        const ret = {
          ...item,
          isReadonly,
          disabled: disabled || isReadonly,
          sub: sub && sub.length ? filterMenu(sub, paths.concat([name])) : []
        }

        if (ret.groups && ret.groups.length) {
          ret.groups = ret.groups
            .map(g => ({
              ...g,
              sub: g.sub.filter(s => checkHasPermissions(paths.concat([name]), s.name, !defaultHiddenList.includes(s.name)))
            }))
            .filter(g => g.sub.length)
        }

        return ret
      })
  }

  return filterMenu(list, ['menu']).filter(item => {
    const { sub = [], groups = [] } = item
    return sub.length || groups.length
  })
}

export const getDisabledMenuList = ({ list = [], isAdmin, isOrgRole, isOrgAdmin } = {}) => {
  const ret = []
  const defaultHiddenList = getDefaultHiddenList(isAdmin, isOrgRole, isOrgAdmin)

  const filterMenu = (list, paths) => {
    return list.forEach(item => {
      const { name, sub } = item
      const isDeny = !checkHasPermissions(paths, name, !defaultHiddenList.includes(name))

      if (isDeny) {
        if (sub && sub.length) {
          ret.push(...sub.map(s => s.name))
        } else {
          ret.push(name)
        }
      } else {
        if (sub && sub.length) {
          filterMenu(sub, paths.concat([name]))
        }
      }
    })
  }

  filterMenu(list, ['menu'])

  return ret
}