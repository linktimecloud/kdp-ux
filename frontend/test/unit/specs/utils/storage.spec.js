import { Local } from '@/utils/storage'

console.log('lOCAL', Local)
describe('Local storage utils', () => {
  it('Local should be act like localstorage', () => {
    expect(typeof Local).toBe('object')
    expect(typeof Local.setItem).toBe('function')
    expect(typeof Local.getItem).toBe('function')
  })
})
