import { versionFormat, versionValid, versionCompare, transformVersion } from '@/utils/version'

describe('version utils', () => {
  describe('versionFormat funciton', () => {
    test('is a function', () => {
      expect(typeof versionFormat).toBe('function')
    })

    test('should coerce a string into SemVer if possible', () => {
      expect(versionFormat('1.2.3--beta').version).toBe('1.2.3')
      expect(versionFormat('42.6.7.9.3-alpha').version).toBe('42.6.7')
    })
  })

  describe('versionValid funciton', () => {
    test('is a function', () => {
      expect(typeof versionValid).toBe('function')
    })

    test('should return false if version not valid', () => {
      expect(versionValid('hello')).toBeFalsy()
      expect(versionValid('42.6.7.9.3-alpha')).toBeFalsy()
    })

    test('should return true if version is valid', () => {
      expect(versionValid('1.2.3')).toBeTruthy()
      expect(versionValid('1.2.3-beta')).toBeTruthy()
      expect(versionValid('1.2.3--beta')).toBeTruthy()
    })
  })


  describe('versionCompare funciton', () => {
    test('is a function', () => {
      expect(typeof versionCompare).toBe('function')
    })

    test('should return false if first version is not valid', () => {
      expect(versionCompare('hello')).toBeFalsy()
    })

    test('should return false if second version is not valid', () => {
      expect(versionCompare('1.0.1', 'world')).toBeFalsy()
    })

    test('should return 1 if first version is newer than second version', () => {
      expect(versionCompare('1.2.3--beta', '1.2.2-alpha')).toBe(1)
    })

    test('should return -1 if first version is older than second version', () => {
      expect(versionCompare('v2', 'v3')).toBe(-1)
    })

    test('should return 0 if first version is same than second version', () => {
      expect(versionCompare('1.0.0', 'v1')).toBe(0)
      expect(versionCompare('1.2.3--beta', '1.2.3--alpha')).toBe(0)
    })
  })

  describe('transformVersion funciton', () => {
    test('is function', () => {
      expect(typeof transformVersion).toBe('function')
    })

    test('should have name argument', () => {
      return expect(transformVersion({})).toBe('')
    })

    test('if no app data, it is a 1.0 version', () => {
      return expect(transformVersion({name: 'somename'})).toBe('1.0')
    })

    test('if there is app version , and not set increase, it should increase sub version', () => {
      return expect(transformVersion({
        name: 'somename',
        app: { version: '1.2' }
      })).toBe('1.3')
    })

    test('if there is app version , and set increase, it should increase major version', () => {
      return expect(transformVersion({
        name: 'somename',
        app: { version: '1.2' },
        increase: true
      })).toBe('2.0')
    })
  })
})
