import { getProcessTitleText } from '@/pages/record/process/utils.js'
import i18n from '@/i18n'

describe('pages process utils', () => {
  describe('test getProcessTitleText funciton', () => {
    it('check default return value', () => {
      expect(getProcessTitleText()).toBe('  ')
    })

    it('check has handle key', () => {
      expect(getProcessTitleText({ handle: 'install', category: 'koala-category', name: 'koala-name' })).toBe(`${i18n.t('process.handle.install')} koala-name koala-category`)
    })

    it('check return value', () => {
      expect(getProcessTitleText({ handle: 'koala-handle', category: 'koala-category', name: 'koala-name' })).toBe('koala-handle koala-name koala-category')
    })
  })
})
