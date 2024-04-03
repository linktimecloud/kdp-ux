import { computed } from 'vue'
import { defineStore } from 'pinia'

import i18n from '@/i18n'
import * as ENV from '@/env'

import { SUPPORTED_LANG_LIST } from '@/constant'

export const useLanguagesStore = defineStore('languages', () => {
  const getLang = (lang) => {
    if (SUPPORTED_LANG_LIST().find(item => item.lang === lang)) {
      return lang
    } else {
      return ENV.DEFAULT_LANG
    }
  }

  const currentLang = computed(() => {
    const lang = localStorage.getItem('lang')
    return getLang(lang)
  })

  const setLang = (lang) => {
    const curLang = getLang(lang)

    i18n.global.locale = curLang
    localStorage.setItem('lang', curLang)
  }

  return { currentLang, setLang }
})
