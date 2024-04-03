import * as utils from '@/utils/utils'

describe('utils', () => {
  test('loaded', () => {
    expect(typeof utils).toBe('object')
  })
  // private variable protected
  test('private variable protected ok', () => {
    expect(typeof handlers).toBe('undefined')
  })
  // strip ok
  test('strip ok', () => {
    const str =
      '<div><span><a href="abj.chk">12345678<i class="fa fa-test">90</i></a></span></div>'
    expect(utils.strip(str)).toBe('1234567890')
    expect(utils.strip()).toBe('')
  })

  describe('test formatDurationTime function', () => {
    test('return empty string', () => {
      expect(utils.formatDurationTime()).toBe('0 秒')
    })

    test('check format duration time', () => {
      expect(utils.formatDurationTime(60)).toBe('1 分')
      expect(utils.formatDurationTime(60 * 60 * 0.5)).toBe('30 分')
      expect(utils.formatDurationTime(60 * 60)).toBe('1 时')
      expect(utils.formatDurationTime(60 * 60 * 23)).toBe('23 时')
      expect(utils.formatDurationTime(60 * 60 * 24)).toBe('1 天')
      expect(utils.formatDurationTime(60 * 60 * 24 * 6)).toBe('6 天')
      expect(utils.formatDurationTime(60 * 60 * 24 * 7)).toBe('1 周')
      expect(utils.formatDurationTime(60 * 60 * 24 * 7 * 3)).toBe('3 周')
      expect(utils.formatDurationTime(60 * 60 * 24 * 30 * 2)).toBe('2.0 月')
      expect(utils.formatDurationTime(60 * 60 * 24 * 30 * 14)).toBe('1.1 年')
    })

    test('check startUnit', () => {
      expect(utils.formatDurationTime(7, 'day')).toBe('1 周')
      expect(utils.formatDurationTime(365 * 1.5, 'day')).toBe('1.5 年')
    })
  })

  describe('test flattenObj function', () => {
    test('return empty obj', () => {
      expect(utils.flattenObj({})).toEqual({})
    })

    test('return flatten obj', () => {
      expect(utils.flattenObj({
        a: {
          b: {
            c: 123
          },
          d: 456
        },
        e: 789
      })).toEqual({ 'a.b.c': 123, 'a.d': 456, e: 789 })
    })

    test('return omit key', () => {
      expect(utils.flattenObj({
        a: {
          b: {
            c: 123
          },
          d: 456
        },
        e: 789
      }, 'c')).toEqual({ 'a.b': 123, 'a.d': 456, e: 789 })
    })
  })
})

describe('test beautifyDataUnit function', () => {
  test('return empty string', () => {
    expect(utils.beautifyDataUnit({})).toBe('')
  })

  test('return default unit', () => {
    expect(utils.beautifyDataUnit({ data: 1024 })).toBe('1024 Byte')
    expect(utils.beautifyDataUnit({ data: 1024, micrometer: true })).toBe('1,024 Byte')
  })

  test('return string', () => {
    expect(utils.beautifyDataUnit({ data: 2048, startUnit: 'MiB' })).toBe('2 GiB')
  })

  test('return string', () => {
    expect(
      utils.beautifyDataUnit({
        data: 1.3457,
        startUnit: 'MiB',
        decimalDigits: 2,
        needBlankSpace: false
      })
    ).toBe('1.35MiB')
  })

  test('return string', () => {
    expect(utils.beautifyDataUnit({ data: 1.3457, startUnit: 'GiB' })).toBe(
      '1.3 GiB'
    )
  })

  test('return string', () => {
    expect(utils.beautifyDataUnit({ data: 1078, startUnit: 'MiB' })).toBe(
      '1.1 GiB'
    )
  })
})

describe('test clearFile function', () => {
  test('clearFile should clear file input', () => {
    const input = {
      value: 'file'
    }
    utils.clearFile(input)
    expect(input.value).toBe('')
  })
  test('check special browser input clear file', () => {
    const parentDom = document.createElement('div')
    let specialInput = document.createElement('input')
    Object.defineProperty(specialInput, 'value', {
      get () {
        return 'koala'
      },
      set (newValue) {
        specialInput = document.createElement('input')
      }
    })
    parentDom.appendChild(specialInput)

    utils.clearFile(specialInput)
    expect(specialInput.value).toBe('')
  })
})

describe('test getLabelFormat function', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('if label is object', () => {
    const labels = {
      en: 'hahaha',
      cn: '哈哈哈'
    }

    jest.doMock('@/store', () => ({
      getters: {
        lang: 'en'
      }
    }))
    return import('@/utils/utils').then(({ getLabelformat }) => {
      expect(getLabelformat(labels)).toBe('hahaha')
    })
  })
  test('if label not object', () => {
    expect(utils.getLabelformat('啦啦啦')).toBe('啦啦啦')
    expect(utils.getLabelformat(123)).toBe(123)
    expect(utils.getLabelformat(undefined)).toBe(undefined)
  })
})

describe('test formatPercentage function', () => {
  test('returns the percentage with one decimal place', () => {
    expect(utils.formatPercentage(0.1234)).toBe('12.3%')
  })

  test('returns the percentage with two decimal places', () => {
    expect(utils.formatPercentage(0.1234, 2)).toBe('12.34%')
  })

  test('returns "0" when the input is zero', () => {
    expect(utils.formatPercentage(0)).toBe('0')
  })

  test('returns "0" when the input is undefined', () => {
    expect(utils.formatPercentage()).toBe('0')
  })

  test('returns "0" when the input is NaN', () => {
    expect(utils.formatPercentage(NaN)).toBe('0')
  })
})

describe('test getPercentage function', () => {
  test('it should return 0 if divisor is `0`', () => {
    expect(utils.getPercentage(2, 0)).toBe(0)
  })

  test('it should return 0 if numerator is not valid', () => {
    expect(utils.getPercentage(0, 1)).toBe(0)
    expect(utils.getPercentage(null, 1)).toBe(0)
    expect(utils.getPercentage(undefined, 1)).toBe(0)
    expect(utils.getPercentage('aaa', 1)).toBe(0)
  })

  test('it should return correct percentage', () => {
    expect(utils.getPercentage(16, 64)).toBe(0.25)
  })
})

describe('sortListWithoutNull', () => {
  test('should return empty array when no parameters are provided', () => {
    const result = utils.sortListWithoutNull({})
    expect(result).toEqual([])
  })

  test('should sort the list in ascending order by default, without null values', () => {
    const list = [{ name: 'John' }, { name: 'Mark' }, { name: null }, { name: 'Alice' }]
    const expected = [{ name: 'Mark' }, { name: 'John' }, { name: 'Alice' }, { name: null }]
    const result = utils.sortListWithoutNull({ list, prop: 'name' })
    expect(result).toEqual(expected)
  })

  test('should sort the list in descending order by sub-property, removing null values', () => {
    const list = [
      { name: { firstName: 'John', lastName: 'Doe' } },
      { name: { firstName: null, lastName: 'Johnson' } },
      { name: { firstName: 'Alice', lastName: 'Smith' } },
      { name: { firstName: 'Mark', lastName: 'Brown' } }
    ]
    const expected = [
      { name: { firstName: 'Mark', lastName: 'Brown' } },
      { name: { firstName: 'John', lastName: 'Doe' } },
      { name: { firstName: 'Alice', lastName: 'Smith' } },
      { name: { firstName: null, lastName: 'Johnson' } }
    ]
    const result = utils.sortListWithoutNull({ list, prop: 'name', subProp: 'firstName', order: 'desc' })
    expect(result).toEqual(expected)
  })
})
