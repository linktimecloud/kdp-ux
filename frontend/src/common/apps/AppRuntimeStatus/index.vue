<script>
import { GRAY_COLOR } from '@/constant/color'
import { LOAD_BALANCER_STATUS } from '@/constant/application'

export default {
  name: 'app-runtime-status',
  props: {
    status: {
      type: String,
      default: ''
    },
    overrideTypes: Array
  },
  data () {
    return {
      GRAY_COLOR
    }
  },
  computed: {
    item () {
      const { overrideTypes } = this
      const status = this.status || 'unknown'
      const item = (overrideTypes || LOAD_BALANCER_STATUS()).find(item => item.value === status) || {}
      const style = `background-color: ${item.color || GRAY_COLOR}`
      const color = item.color || GRAY_COLOR
      const statusText = item.label || this.$t('cluster.unknown')

      return { status, style, statusText, color }
    }
  }
}
</script>

<template lang="pug">
.app-runtime-status.d-flex.align-items-center(v-if="status")
  .dot(:style="item.style")
  span.ml-2(:style="item.color === GRAY_COLOR ? { color: GRAY_COLOR } : {}") {{ item.statusText }}
</template>

<style lang="scss">
.app-runtime-status {
  .dot {
    height: 6px;
    width: 6px;
    display: inline-block;
    border-radius: 50%;
  }
}
</style>
