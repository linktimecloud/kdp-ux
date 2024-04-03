import { getActionPermissions, checkHasPermissions } from '@/utils/permissions'

describe('getActionPermissions', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should return an empty array when prePaths and action are not provided', () => {
    expect(getActionPermissions()).toEqual([])
  })

  it('should return an empty array when userPermissions is not defined', () => {
    jest.doMock('@/store', () => ({
      getters: {}
    }))
    return import('@/utils/permissions').then(({ getActionPermissions }) => {
      expect(getActionPermissions(['menu'], 'allow')).toEqual([])
    })
  })

  it('should return an array of strings when userPermissions is defined', () => {
    const userPermissions = {
      deny: ['step__d__400__d__etl', 'step__d__400__d__etl2', 'step__d__401']
    }
    jest.doMock('@/store', () => ({
      getters: { userPermissions }
    }))
    return import('@/utils/permissions').then(({ getActionPermissions }) => {
      expect(getActionPermissions(['step', '400'], 'deny')).toEqual(['etl', 'etl2'])
    })
  })

  it('should return an empty array when there is no matching resource', () => {
    const userPermissions = {
      deny: ['step__d__401', 'step__d__402']
    }
    jest.doMock('@/store', () => ({
      getters: { userPermissions }
    }))
    return import('@/utils/permissions').then(({ getActionPermissions }) => {
      expect(getActionPermissions(['step', '400'], 'deny')).toEqual([])
    })
  })

  it('should return an array with one element when there is one matching resource', () => {
    const userPermissions = {
      deny: ['step__d__400__d__etl']
    }
    jest.doMock('@/store', () => ({
      getters: { userPermissions }
    }))
    return import('@/utils/permissions').then(({ getActionPermissions }) => {
      expect(getActionPermissions(['step', '400'], 'deny')).toEqual(['etl'])
    })
  })
})

describe('checkHasPermissions', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('@/store', () => ({
      getters: { userPermissions: { deny: ['path1__d__path2'] } }
    }))
  })

  it('should return true when key is included in grant permission', () => {
    const prePaths = ['path1', 'path2']
    const key = 'create'
    const defaultPermissions = true
    const hasPermissions = checkHasPermissions(prePaths, key, defaultPermissions)

    expect(hasPermissions).toBe(true)
  })

  it('should return false when key is included in deny permission', () => {
    const prePaths = ['path1', 'path2']
    const key = 'create'
    const defaultPermissions = true

    jest.doMock('@/store', () => ({
      getters: { userPermissions: { deny: ['path1__d__path2__d__create'] } }
    }))
    return import('@/utils/permissions').then(({ checkHasPermissions }) => {
      expect(checkHasPermissions(prePaths, key, defaultPermissions)).toBe(false)
    })
  })

  it('should return true when defaultPermissions is true and key is not in deny permission', () => {
    const prePaths = ['path1', 'path2']
    const key = 'create'
    const defaultPermissions = true

    expect(checkHasPermissions(prePaths, key, defaultPermissions)).toBe(true)
  })

  it('should return true when defaultPermissions is undefined and key is not in deny permission', () => {
    const prePaths = ['path1', 'path2']
    const key = 'create'

    expect(checkHasPermissions(prePaths, key)).toBe(true)
  })

  it('should return false when defaultPermissions is false and key is not in grant permission', () => {
    const prePaths = ['path1', 'path2']
    const key = 'create'
    const defaultPermissions = false

    expect(checkHasPermissions(prePaths, key, defaultPermissions)).toBe(false)
  })
})
