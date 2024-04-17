import { describe, expect, it } from 'vitest'
import { timeformat, getUrlQuery } from '@/utils/utils.js'

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