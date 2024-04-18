<script>
import ReasonButton from '@/common/ReasonButton.vue'

export default {
  name: 'ExportCsv',
  components: {
    ReasonButton
  },
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    cls: {
      type: [String, Object],
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    tip: {
      type: String,
      default: ''
    }
  },
  computed: {
    reason () {
      return this.disabled ? this.$t('common.exportCsvDisabledTip') : ''
    }
  }
}
</script>

<template lang="pug">
ReasonButton(:tip="tip || $t('common.exportCsvTip')", :type="type", :reason="reason", @click="$emit('exportCsv')")
  i.remix.ri-file-upload-line
  span {{ $t('files.exportCsv') }}
</template>
