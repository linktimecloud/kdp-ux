import { describe, expect, it, beforeEach, vi } from 'vitest'

import { getSidebarMenuList, getDisabledMenuList } from '@/components/sidebar/utils'

const commonObj = {
  isReadonly: false,
  disabled: false,
  sub: []
}

describe('sidebar utils', () => {
  describe('getSidebarMenuList', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('check default return value', () => {
      expect(getSidebarMenuList()).toEqual([])
    })

    it('If there are no sub and group, they should be filtered', async () => {
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions: {} }) }))
      return import('@/components/sidebar/utils').then(({ getSidebarMenuList }) => {
        expect(getSidebarMenuList({ list: [{ name: 'aa' }, { name: 'bb' }] })).toEqual([])
      })
    })

    it('Only is admin can access the permission menu', async () => {
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions: {} }) }))
      return import('@/components/sidebar/utils').then(({ getSidebarMenuList }) => {
        expect(getSidebarMenuList({ list: [{ name: 'aa', sub: [{ name: 'permission' }] }] })).toEqual([])
        expect(getSidebarMenuList({ list: [{ name: 'aa', sub: [{ name: 'permission' }] }], isAdmin: true })).toEqual([
          {
            name: 'aa',
            ...commonObj,
            sub: [{ name: 'permission', ...commonObj }]
          }
        ])
      })
    })

    it('check is deny', async () => {
      const userPermissions = {
        deny: ['menu__d__aa']
      }
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions }) }))

      return import('@/components/sidebar/utils').then(({ getSidebarMenuList }) => {
        expect(getSidebarMenuList({ list: [{ name: 'aa' }, { name: 'bb', sub: [{ name: 'bb-sub' }] }] })).toEqual([
          { name: 'bb', ...commonObj, sub: [{ name: 'bb-sub', ...commonObj }] }
        ])
      })
    })

    it('check has sub', async () => {
      const userPermissions = {
        deny: ['menu__d__11__d__11-1', 'menu__d__22']
      }
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions }) }))

      return import('@/components/sidebar/utils').then(({ getSidebarMenuList }) => {
        expect(getSidebarMenuList({
          list: [
            { name: '11', sub: [{ name: '11-1' }, { name: '11-2' }] },
            { name: '22' }
          ]
        })).toEqual([
          { name: '11', ...commonObj, sub: [{ name: '11-2', ...commonObj }] }
        ])
      })
    })

    it('check has group', async () => {
      const userPermissions = {
        deny: ['menu__d__11__d__11-1', 'menu__d__22__d__22-2']
      }
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions }) }))

      return import('@/components/sidebar/utils').then(({ getSidebarMenuList }) => {
        expect(getSidebarMenuList({
          list: [
            { name: '11', sub: [{ name: '11-1' }, { name: '11-2' }] },
            { name: '22', groups: [{ title: '分类1', sub: [{ name: '22-1' }] }, { title: '分类2', sub: [{ name: '22-2' }] }] }
          ]
        })).toEqual([
          { name: '11', ...commonObj, sub: [{ name: '11-2', ...commonObj }] },
          { name: '22', ...commonObj, groups: [{ title: '分类1', sub: [{ name: '22-1' }] }] }
        ])
      })
    })
  })

  describe('getDisabledMenuList', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('check default return value', () => {
      expect(getDisabledMenuList()).toEqual([])
    })

    it('check default permission menu', () => {
      const list = [
        { name: 'groups' },
        { name: 'aa' },
        { name: 'users' },
        { name: 'bb' },
        { name: 'roles' },
        { name: 'cc' },
        { name: 'clusters' }
      ]
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions: {} }) }))

      return import('@/components/sidebar/utils').then(({ getDisabledMenuList }) => {
        expect(getDisabledMenuList({ list })).toEqual(['groups', 'users', 'roles', 'clusters'])
        expect(getDisabledMenuList({ list, isAdmin: true })).toEqual([])
        expect(getDisabledMenuList({ list, isAdmin: false, isOrgAdmin: true })).toEqual(['roles', 'clusters'])
      })
    })

    it('check disabled menu', async () => {
      const userPermissions = {
        deny: [
          'menu__d__aa',
          'menu__d__bb__d__bb-1',
          'menu__d__bb__d__bb-5678',
          'menu__d__cc'
        ]
      }
      vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => ({ userPermissions }) }))

      return import('@/components/sidebar/utils').then(({ getDisabledMenuList }) => {
        expect(getDisabledMenuList({
          list: [
            { name: 'aa', sub: [{ name: 'aa-1' }, { name: 'aa-2' }] },
            { name: 'bb', sub: [{ name: 'bb-1' }, { name: 'bb-2' }, { name: 'bb-3' }] },
            { name: 'cc' }
          ]
        })).toEqual(['aa-1', 'aa-2', 'bb-1', 'cc'])
      })
    })
  })
})
