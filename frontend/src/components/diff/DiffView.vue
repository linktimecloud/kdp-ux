<script>
import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

/**
 * Component Settings
 */
export default {
  name: 'DiffHtml',
  props: {
    data: {
      type: String,
      default: ''
    },
    cls: {
      type: [String, Object],
      default: ''
    }
  },
  computed: {
    result () {
      return Diff2Html.html(this.data, {
        drawFileList: false,
        matching: 'lines'
      })
    }
  }
}
</script>

<template lang="pug">
.diff(
  :class="cls",
  v-html="result"
)
</template>
