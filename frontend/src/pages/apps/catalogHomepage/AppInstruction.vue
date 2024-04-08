<script>
import { API_BASE } from '@/env'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'
import { useLanguagesStore } from '@/stores/modules/languages'

const languagesStore = useLanguagesStore()

export default {
  name: 'app-instruction',
  props: {
    catalog: {
      type: String,
      default: ''
    },
    form: {
      type: String,
      default: ''
    }
  },
  components: {
    EmptyHolder
  },
  computed: {
    lang () {
      return languagesStore.currentLang
    },
    link () {
      const self = this

      const { catalog, form, lang } = self

      let path = ''
      if (catalog && form) {
        path = `${catalog}/app_forms/${form}/readme`
      } else {
        path = `${catalog}/readme`
      }

      return `${API_BASE}/api/catalogManagerService/api/v1/catalogs/${path}?lang=${lang}`
    }
  }
}
</script>

<template lang="pug">
.app-instruction.h-full
  .shadow-box.w-full.h-full
    iframe.w-full.h-full.px-2.pt-2(
      v-if="link",
      :frameBorder="0",
      :src="link"
    )
    EmptyHolder(v-else)
</template>

<style lang="scss">
.app-instruction {
  height: calc(100% - 8px);
}
</style>
