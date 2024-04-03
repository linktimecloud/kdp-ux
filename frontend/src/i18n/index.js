import { createI18n } from 'vue-i18n'

import { DEFAULT_LANG } from '@/env'

import messages from './messages'

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LANG,
  fallbackLocale: DEFAULT_LANG,
  messages
})

i18n.t = i18n.global.t
i18n.te = i18n.global.te

export default i18n
