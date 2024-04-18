<script setup>
import { useClipboard } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import i18n from '@/i18n'

const props = defineProps({
  appLinks: {
    type: Array,
    default: () => ([])
  }
})

const copyContent = (link) => {
  if (link) {
    useClipboard(link)
    ElNotification({
      type: 'success',
      message: i18n.t('common.copySuccess')
    })
  }
}
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
            el-button(type="primary", link, @click="copyContent(item.link)")
              i.remix.ri-file-copy-line
          a(v-else, :href="item.link", target="_blank")
            span {{ item.link }}
</template>
