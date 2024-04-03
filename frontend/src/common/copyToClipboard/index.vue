<script>
import { copyToClipboard } from '@/utils/document'
import i18n from '@/i18n'

export default {
  name: 'copy-clipboard-icon',
  props: {
    content: {
      type: [String, Number],
      default: ''
    },
    tip: {
      type: String,
      default: i18n.t('common.clickToCopy')
    },
    cls: {
      type: [String, Array],
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data () {
    return {
      show: false,
      tipContent: ''
    }
  },
  watch: {
    tip () {
      this.tipContent = this.tip
    }
  },
  methods: {
    copyContent () {
      copyToClipboard(this.content)
      this.tipContent = i18n.t('common.copySuccess')
      this.show = true
      setTimeout(() => this.updateTip(), 1000)
    },
    updateTip () {
      this.tipContent = this.tip
      this.show = false
    }
  },
  mounted () {
    this.tipContent = this.tip
  }
}
</script>
<template lang="pug">
.copy-clipboard-icon
  el-tooltip(
    :value="show"
    :content="tipContent",
    :placement="placement"
    :manual="show"
  )
    div(slot="content", style="white-space: pre-wrap;") {{ tipContent }}
    button.btn.btn-sm.btn-link.mr-0.text-decoration-none(
      :class="cls",
      @click="copyContent",
      style="width: auto; max-width: 100%;"
    )
      slot
        i.fas.fa-clone.text-primary
</template>
