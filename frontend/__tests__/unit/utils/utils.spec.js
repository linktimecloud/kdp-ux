import { describe, expect, it } from 'vitest'
import {
  timeformat,
  getUrlQuery,
  formatDurationTime,
  flattenObj,
  beautifyDataUnit,
  formatPercentage,
  getPercentage,
  sortListWithoutNull,
  filterTableList
} from '@/utils/utils.js'

describe('timeformat', () => {
  it('should return formatted time', () => {
    expect(timeformat(1713312000000)).toBe('2024-04-17 08:00:00')
    expect(timeformat(1713312000000, 'YYYY-MM-DD')).toBe('2024-04-17')
  })

  it('should return empty string if time is not provided', () => {
    expect(timeformat(null)).toBe('')
  })
})

describe('getUrlQuery', () => {
  it('should return an object with query parameters', () => {
    const url = 'http://example.com/?param1=value1&param2=value2'
    const expected = {
      param1: 'value1',
      param2: 'value2'
    }
    const result = getUrlQuery(url)
    expect(result).to.deep.equal(expected)
  })

  it('should return an empty object if no query parameters are present', () => {
    const url = 'http://example.com/'
    const expected = {}
    const result = getUrlQuery(url)
    expect(result).to.deep.equal(expected)
  })
})

describe('test formatDurationTime function', () => {
  it('return empty string', () => {
    expect(formatDurationTime()).toBe('0 秒')
  })

  it('check format duration time', () => {
    expect(formatDurationTime(60)).toBe('1 分')
    expect(formatDurationTime(60 * 60 * 0.5)).toBe('30 分')
    expect(formatDurationTime(60 * 60)).toBe('1 时')
    expect(formatDurationTime(60 * 60 * 23)).toBe('23 时')
    expect(formatDurationTime(60 * 60 * 24)).toBe('1 天')
    expect(formatDurationTime(60 * 60 * 24 * 6)).toBe('6 天')
    expect(formatDurationTime(60 * 60 * 24 * 7)).toBe('1 周')
    expect(formatDurationTime(60 * 60 * 24 * 7 * 3)).toBe('3 周')
    expect(formatDurationTime(60 * 60 * 24 * 30 * 2)).toBe('2.0 月')
    expect(formatDurationTime(60 * 60 * 24 * 30 * 14)).toBe('1.1 年')
  })

  it('check startUnit', () => {
    expect(formatDurationTime(7, 'day')).toBe('1 周')
    expect(formatDurationTime(365 * 1.5, 'day')).toBe('1.5 年')
  })
})

describe('test flattenObj function', () => {
  it('return empty obj', () => {
    expect(flattenObj({})).toEqual({})
  })

  it('return flatten obj', () => {
    expect(flattenObj({
      a: {
        b: {
          c: 123
        },
        d: 456
      },
      e: 789
    })).toEqual({ 'a.b.c': 123, 'a.d': 456, e: 789 })
  })

  it('return omit key', () => {
    expect(flattenObj({
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

describe('test beautifyDataUnit function', () => {
  it('return empty string', () => {
    expect(beautifyDataUnit({})).toBe('')
  })

  it('return default unit', () => {
    expect(beautifyDataUnit({ data: 1024 })).toBe('1024 Byte')
    expect(beautifyDataUnit({ data: 1024, micrometer: true })).toBe('1,024 Byte')
  })

  it('return string', () => {
    expect(beautifyDataUnit({ data: 2048, startUnit: 'MiB' })).toBe('2 GiB')
  })

  it('return string', () => {
    expect(
      beautifyDataUnit({
        data: 1.3457,
        startUnit: 'MiB',
        decimalDigits: 2,
        needBlankSpace: false
      })
    ).toBe('1.35MiB')
  })

  it('return string', () => {
    expect(beautifyDataUnit({ data: 1.3457, startUnit: 'GiB' })).toBe(
      '1.3 GiB'
    )
  })

  it('return string', () => {
    expect(beautifyDataUnit({ data: 1078, startUnit: 'MiB' })).toBe(
      '1.1 GiB'
    )
  })
})

describe('test formatPercentage function', () => {
  it('returns the percentage with one decimal place', () => {
    expect(formatPercentage(0.1234)).toBe('12.3%')
  })

  it('returns the percentage with two decimal places', () => {
    expect(formatPercentage(0.1234, 2)).toBe('12.34%')
  })

  it('returns "0" when the input is zero', () => {
    expect(formatPercentage(0)).toBe('0')
  })

  it('returns "0" when the input is undefined', () => {
    expect(formatPercentage()).toBe('0')
  })

  it('returns "0" when the input is NaN', () => {
    expect(formatPercentage(NaN)).toBe('0')
  })
})

describe('test getPercentage function', () => {
  it('it should return 0 if divisor is `0`', () => {
    expect(getPercentage(2, 0)).toBe(0)
  })

  it('it should return 0 if numerator is not valid', () => {
    expect(getPercentage(0, 1)).toBe(0)
    expect(getPercentage(null, 1)).toBe(0)
    expect(getPercentage(undefined, 1)).toBe(0)
    expect(getPercentage('aaa', 1)).toBe(0)
  })

  it('it should return correct percentage', () => {
    expect(getPercentage(16, 64)).toBe(0.25)
  })
})

describe('sortListWithoutNull', () => {
  it('should return empty array when no parameters are provided', () => {
    const result = sortListWithoutNull({})
    expect(result).toEqual([])
  })

  it('should sort the list in ascending order by default, without null values', () => {
    const list = [{ name: 'John' }, { name: 'Mark' }, { name: null }, { name: 'Alice' }]
    const expected = [{ name: 'Mark' }, { name: 'John' }, { name: 'Alice' }, { name: null }]
    const result = sortListWithoutNull({ list, prop: 'name' })
    expect(result).toEqual(expected)
  })

  it('should sort the list in descending order by sub-property, removing null values', () => {
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
    const result = sortListWithoutNull({ list, prop: 'name', subProp: 'firstName', order: 'desc' })
    expect(result).toEqual(expected)
  })
})

describe('filterTableList', () => {
  it('should filter the list with single filter parameter', () => {
    const list = [
      { name: 'Test1', age: 21 },
      { name: 'Test2', age: 22 }
    ]
    const filter = { name: 'Test2' }

    const result = filterTableList({ list, filter })

    expect(result).toEqual([
      { name: 'Test2', age: 22 },
    ])
  })

  it('should filter the list with multiple filter parameters', () => {
    const list = [
      { name: 'Test1', age: 21 },
      { name: 'Test2', age: 22 }
    ]
    const filter = { name: 'Test2', age: 22, email: '' }

    const result = filterTableList({ list, filter })

    expect(result).toEqual([
      { name: 'Test2', age: 22 }
    ])
  })

  it('should filter the list irrespective of case of filter parameters', ()=> {
    const list = [
      { name: 'Test1', age: 21 },
      { name: 'Test2', age: 22 }
    ]
    const filter = { name: 'test2' }

    const result = filterTableList({ list, filter })

    expect(result).toEqual([
      { name: 'Test2', age: 22 },
    ])
  })

  it('should filter the list based on custom compare function', () => {
    const list = [
      { name: 'Test1', age: 21, gender: 'male' },
      { name: 'Test2', age: 22, gender: 'female' },
      { name: 'Test3', age: 23, gender: 'male' }
    ]
    const filter = { gender: 'ma' }
    const compareFuncs = {
      gender: (itemValue, filterValue) => itemValue.startsWith(filterValue),
    }

    const result = filterTableList({ list, filter, compareFuncs })

    expect(result).toEqual([
      { name: 'Test1', age: 21, gender: 'male' },
      { name: 'Test3', age: 23, gender: 'male' },
    ])
  })

  it('should sort the list based on given order parameters', () => {
    const list = [
      { name: 'Test1', age: 23 },
      { name: 'Test2', age: 21 },
      { name: 'Test3', age: 22 }
    ]

    const result = filterTableList({ list, order: 'desc', orderBy: 'age' })

    expect(result).toEqual([
      { name: 'Test1', age: 23 },
      { name: 'Test3', age: 22 },
      { name: 'Test2', age: 21 }
    ])
  })
})
