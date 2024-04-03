import { camelCase } from 'lodash'
import i18n from '@/i18n'

export const getProcessTitleText = (row = {}) => {
  const { handle, category, name } = row
  const getTranslation = (key, type) => i18n.te(`process.${type}.${camelCase(key)}`) ? i18n.t(`process.${type}.${camelCase(key)}`) : key
  return [
    getTranslation(handle, 'handle'),
    name,
    getTranslation(category, 'category')
  ].join(' ')
}
