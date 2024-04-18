<script>
import { marked } from 'marked'

import 'github-markdown-css/github-markdown.css'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

export default {
  name: 'FormatMarkdown',
  components: {
    EmptyHolder
  },
  props: {
    data: {
      type: String,
      default: ''
    },
    scrollable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    html () {
      return this.data ? marked(this.data) : ''
    },
    cls () {
      const scrollable = this.scrollable
      return { scrollable }
    }
  }
}
</script>

<template lang="pug">
.format-markdown
  .markdown-body.p-2(
    v-if="data",
    :class="cls",
    v-html="html"
  )
  EmptyHolder(v-else)
</template>

<style lang="scss">
.format-markdown .markdown-body.scrollable {
  max-height: calc(80vh - 100px);
  overflow-y: auto;
}
</style>
