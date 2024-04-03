<script>
import { copyToClipboard } from '@/utils/document'

export default {
  name: 'application-homepage-button',
  props: {
    appLinks: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    copyContent (link) {
      if (link) {
        copyToClipboard(link)
        this.$message({
          type: 'success',
          message: this.$t('common.copySuccess')
        })
      }
    }
  }
}
</script>

<template lang="pug">
span.application-homepage-button(v-if="appLinks.length")
  el-dropdown
    el-button(type="primary") {{ $t('applications.toHomePage') }}
    el-dropdown-menu(slot="dropdown")
      el-dropdown-item(v-for="(item, idx) in appLinks" :key="idx")
        .d-flex.justify-content-between(v-if="item.inner")
          span {{ item.link }}(Inner)
          el-button(type="text", @click="copyContent(item.link)")
            i.remix.ri-file-copy-line
        a(v-else, :href="item.link", target="_blank")
          span {{ item.link }}
</template>
