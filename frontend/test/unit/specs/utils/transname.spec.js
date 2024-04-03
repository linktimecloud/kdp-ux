import { transMenuName } from '@/utils/transname'

describe('@/utils/transname', () => {
  test('transMenuName nothing', () => {
    expect(transMenuName()).toBe('')
  })

  test('transMenuName a name that exist in i18n menu', () => {
    expect(transMenuName('tour')).toBe('快速体验')
  })

  test('transMenuName a name that dose not exist in i18n menu', () => {
    expect(transMenuName('haha')).toBe('haha')
  })
})
