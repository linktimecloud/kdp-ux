<script>
import { toLower } from 'lodash'

import { GREEN_COLOR, GRAY_COLOR, DANGER_COLOR, WARNING_COLOR } from '@/constant/color'

const STATUS_COLOR_MAP = {
  running: GREEN_COLOR,
  runningworkflow: GRAY_COLOR,
  abnormal: DANGER_COLOR,
  normal: GREEN_COLOR,
  pending: WARNING_COLOR,
  succeeded: GREEN_COLOR,
  failed: DANGER_COLOR,
  bound: GREEN_COLOR,
  starting: WARNING_COLOR
}

export default {
  name: 'app-status',
  props: {
    data: {
      type: Object
    },
    instance: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    status () {
      return this.data?.status || ''
    },
    item () {
      const { status } = this
      const style = `background-color: ${STATUS_COLOR_MAP[toLower(status)] || GRAY_COLOR}`
      const statusText = this.$te(`applications.${status}`) ? this.$t(`applications.${status}`) : this.$te(`status.${status}`) ? this.$t(`status.${status}`) : status
      return { status, style, statusText }
    }
  }
}
</script>

<template lang="pug">
.app-status.text-left.d-flex.align-items-center(v-if="data")
  .dot.mr-2(v-if="status", :style="item.style")
  span {{ item.statusText || '-' }}
</template>

<style lang="scss">
.app-status {
  .dot {
    height: 6px;
    width: 6px;
    display: inline-block;
    border-radius: 50%;
  }
}
</style>
