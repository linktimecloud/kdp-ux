import { base64ImageStr } from '@/utils/file'

describe('test get app status text function', () => {
  it('base64ImageStr utils should return image base64 url', () => {
    expect(base64ImageStr('abc')).toBe(`data:image/*;base64,abc`)
    expect(base64ImageStr('abc', 'image/gif')).toBe(`data:image/gif;base64,abc`)
    expect(base64ImageStr('data:image/png;base64,abc')).toBe(`data:image/png;base64,abc`)
  })
})
