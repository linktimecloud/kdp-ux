<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

import { SUPPORTED_LANG_LIST } from '@/constant'

import { useLanguagesStore } from '@/stores/modules/languages'

const languagesStore = useLanguagesStore()

const list = ref(SUPPORTED_LANG_LIST())

const lang = computed(() => languagesStore.currentLang)

const current = computed(() => {
  const obj = list.value.find(item => item.lang === lang.value) || list.value[0]
  return ` ${obj.text} `
});

const handleSetLang = async (lang) => {
  const langLabel = list.value.find(item => item.lang === lang).text
  ElMessageBox.confirm(i18n.t('common.setLangTip', { lang: langLabel }), i18n.t('common.attention'), {
    type: 'warning'
  }).then(() => {
    languagesStore.setLang(lang)
    location.reload()
  }).catch(() => {})
}
</script>

<template lang="pug">
.nav-item.flex.items-center
  el-dropdown(
    class="nav-link",
    trigger="click",
    @command="handleSetLang"
  )
    span.text-white
      i.remix.ri-translate.mr-2
      span {{ current }}
    template(#dropdown)
      el-dropdown-menu(
        class="language__select"
      )
        el-dropdown-item(
          v-for="(li, i) in list",
          :command="li.lang",
          :key="i"
        )
          span {{ li.text }}
</template>
