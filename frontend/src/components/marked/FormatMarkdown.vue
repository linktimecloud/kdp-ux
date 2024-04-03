<script>
import { marked } from 'marked'

import 'github-markdown-css/github-markdown.css'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

export default {
  name: 'format-markdown',
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
  },
  components: {
    EmptyHolder
  }
}
</script>

<template lang="pug">
.format-markdown
  .markdown-body.p-2(
    v-if="data",
    v-html="html",
    :class="cls"
  )
  EmptyHolder(v-else)
</template>

<style lang="scss">
.format-markdown .markdown-body.scrollable {
  max-height: calc(80vh - 100px);
  overflow-y: auto;
}
</style>
