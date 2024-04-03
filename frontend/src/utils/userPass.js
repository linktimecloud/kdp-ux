import i18n from '@/i18n'

export const validPasswordForm = ({ form, processing, isOpenId, userName } = {}) => {
  const { password = '', originPassword, confirmPassword } = form || {}
  const rules = [
    { match: processing, content: i18n.t('common.processing') },
    { match: !password, content: i18n.t('pass.passwordError') },
    { match: !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]|_).{8,}$/.test(password), content: i18n.t('pass.validTips') },
    { match: confirmPassword !== password, content: i18n.t('pass.confirmPasswordError') },
    { match: !(originPassword || isOpenId), content: i18n.t('pass.originPasswordError') }
  ]

  return rules.find(rule => rule.match)?.content || ''
}
