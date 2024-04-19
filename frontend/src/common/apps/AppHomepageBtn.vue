<script setup>
import i18n from '@/i18n'

import { copyToClipboard } from '@/utils/utils'

defineProps({
  appLinks: {
    type: Array,
    default: () => ([])
  }
})
</script>

<template lang="pug">
span.application-homepage-button(v-if="appLinks.length")
  el-dropdown
    el-button(type="primary") {{ $t('applications.toHomePage') }}
    template(#dropdown)
      el-dropdown-menu
        el-dropdown-item(v-for="(item, idx) in appLinks" :key="idx")
          .flex.justify-between(v-if="item.inner")
            span {{ item.link }}(Inner)
            el-button(type="primary", link, @click="copyToClipboard({ content: item.link })")
              i.remix.ri-file-copy-line
          a(v-else, :href="item.link", target="_blank")
            span {{ item.link }}
</template>
