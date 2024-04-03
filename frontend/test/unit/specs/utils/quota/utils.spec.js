import { getProportionColor, getMaxProportion, parseQuotaList } from '@/utils/quota/utils.js'
import {
  QUOTA_GRAY,
  GREEN_COLOR,
  WARNING_COLOR,
  DANGER_COLOR
} from '@/constant/color'

describe('settings quota get proportion color test', () => {
  test('input undefined return default color', () => {
    expect(getProportionColor(undefined)).toBe(QUOTA_GRAY)
  })

  test('input 0 return default color', () => {
    expect(getProportionColor(0)).toBe(QUOTA_GRAY)
  })

  test('input 1 return success color', () => {
    expect(getProportionColor(1)).toBe(GREEN_COLOR)
  })

  test('input 61 return warning color', () => {
    expect(getProportionColor(81)).toBe(WARNING_COLOR)
  })

  test('input 81 return warning color', () => {
    expect(getProportionColor(101)).toBe(DANGER_COLOR)
  })
})

describe('settings quota get max proportion number test', () => {
  test('input undefined return 0', () => {
    expect(getMaxProportion(undefined)).toBe(0)
  })

  test('input empty object return 0', () => {
    expect(getMaxProportion({})).toBe(0)
  })

  test('input String return 0', () => {
    expect(getMaxProportion('')).toBe(0)
  })

  test('input quota object return 10', () => {
    const quota = {
      'limits.cpu': {
        proportion: 1
      },
      'limits.memory': {
        proportion: 7
      },
      'requests.storage': {
        proportion: 10
      }
    }
    expect(getMaxProportion(quota)).toBe(10)
  })
})

describe('settings parse quota list function test', () => {
  test('input undefined return empty object', () => {
    expect(parseQuotaList(undefined)).toEqual({})
  })

  test('input illegal value return empty object', () => {
    const data = [{name: 'test'}, {age: '17'}]
    expect(parseQuotaList(data)).toEqual({})
  })

  test('result object', () => {
    const data = [{
      'name': 'quota-caryorg-1647912709954',
      'group': 'caryorg',
      'status': [
        {
          'hard': {
            'limits.cpu': 1
          },
          'used': {
            'limits.cpu': 0.25
          }
        }
      ]
    },
    {
      'name': 'gdy-cpu',
      'group': 'gdy',
      'status': [
        {
          'hard': {
            'limits.cpu': 10
          },
          'used': {
            'limits.cpu': 1
          }
        }
      ]
    }]
    const ret = {
      'caryorg': {
        'limits.cpu': {
          'used': 0.25,
          'hard': 1,
          'name': 'quota-caryorg-1647912709954',
          'proportion': 25
        }
      },
      'gdy': {
        'limits.cpu': {
          'used': 1,
          'hard': 10,
          'name': 'gdy-cpu',
          'proportion': 10
        }
      }
    }
    expect(parseQuotaList(data)).toEqual(ret)
  })

  test('result object', () => {
    const data = [{
      'name': 'quota-caryorg-1647912709954',
      'group': 'caryorg',
      'status': [
        {
          'hard': {
            'limits.cpu': 1
          },
          'used': {
            'limits.cpu': 0.25
          }
        }
      ]
    },
    {
      'name': '',
      'group': 'gdy',
      'status': [
        {
          'used': {
            'limits.cpu': 0
          }
        }
      ]
    }]
    const ret = {
      'caryorg': {
        'limits.cpu': {
          'used': 0.25,
          'hard': 1,
          'name': 'quota-caryorg-1647912709954',
          'proportion': 25
        }
      },
      'gdy': {
        'limits.cpu': {
          'used': '',
          'hard': '',
          'name': '',
          'proportion': 0
        }
      }
    }
    expect(parseQuotaList(data)).toEqual(ret)
  })
})
