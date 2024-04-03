<script>
import CommonTips from '@/common/tips'

import { GRAY_COLOR } from '@/constant/color'
import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'
import { getBdcStatusTip } from '@/utils/cluster/utils'

export default {
  name: 'bdc-status',
  props: {
    status: {
      type: String,
      default: ''
    },
    sign: { // appBdcNotReadyTip/workflowBdcNotReadyTip/podBdcNotReadyTip/bdcUnHealthyTip
      type: String,
      default: 'bdcUnHealthyTip'
    }
  },
  data () {
    return {
      GRAY_COLOR
    }
  },
  computed: {
    item () {
      const { status } = this
      const currentStatus = status || 'InActive'
      const item = (BIG_DATA_CLUSTER_STATUS()).find(item => item.value === currentStatus) || {}
      const style = `background-color: ${item.color || GRAY_COLOR}`
      const color = item.color || GRAY_COLOR
      const statusText = item.label || this.$t('cluster.unknown')

      return { status: currentStatus, style, statusText, color }
    },
    tooltipContent () {
      const { sign, status, item: { statusText } } = this
      return getBdcStatusTip({ sign, status, statusText })
    }
  },
  components: {
    CommonTips
  }
}
</script>

<template lang="pug">
.app-runtime-status.d-flex.align-items-center(v-if="status")
  .dot(:style="item.style")
  span.ml-2(:style="item.color === GRAY_COLOR ? { color: GRAY_COLOR } : {}") {{ item.statusText }}
  CommonTips(v-if="tooltipContent", :content="tooltipContent")
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
