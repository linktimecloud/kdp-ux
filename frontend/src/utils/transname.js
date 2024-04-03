import i18n from '@/i18n'

export const transMenuName = (name = '') => {
  return name && i18n.te(`menu.${name}`) ? i18n.t(`menu.${name}`) : name
}
