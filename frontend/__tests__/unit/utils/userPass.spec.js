import { describe, expect, it } from 'vitest'

import { validPasswordForm } from '@/utils/userPass'
import i18n from '@/i18n'

const COMMON_FORM = {
  password: '12+34=Aa',
  confirmPassword: '12+34=Aa',
  originPassword: 123456
}

describe('userPass utils', () => {
  describe('test validPasswordForm function', () => {
    it('password is required', () => {
      expect(validPasswordForm()).toBe(i18n.t('pass.passwordError'))
    })

    it('avoid duplicate requests when has processing', () => {
      expect(validPasswordForm({ processing: true })).toBe(i18n.t('common.processing'))
    })

    it('confirmPassword is required', () => {
      expect(validPasswordForm({ form: { ...COMMON_FORM, confirmPassword: undefined } })).toBe(i18n.t('pass.confirmPasswordError'))
    })

    it('password and confirmPassword must be equal', () => {
      expect(validPasswordForm({ form: { ...COMMON_FORM, confirmPassword: '12+34!=Aa' } })).toBe(i18n.t('pass.confirmPasswordError'))
    })

    it('required originPassword when not openid', () => {
      expect(validPasswordForm({ form: { ...COMMON_FORM } })).toBe('')
      expect(validPasswordForm({ form: { ...COMMON_FORM, originPassword: undefined } })).toBe(i18n.t('pass.originPasswordError'))
      expect(validPasswordForm({ form: { ...COMMON_FORM, originPassword: undefined }, isOpenId: true })).toBe('')
    })
  })
})
