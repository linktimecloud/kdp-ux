<script setup>
import { computed } from 'vue'
import i18n from '@/i18n'
import { toLower } from 'lodash'

import CommonTips from '@/common/TipsIcon.vue'

import { GRAY_COLOR } from '@/constant/color'
import { SYSTEM_APPLICATION_STATUS, DEFAULT_STATUS_MAP } from '@/constant/application'
import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'
import { getBdcStatusTip } from '@/utils/cluster/utils'

const props = defineProps({
  status: {
    type: String,
    default: ''
  },
  type: { // instance/bigDataCluster
    type: String,
    default: 'default'
  },
  sign: { // appBdcNotReadyTip/workflowBdcNotReadyTip/podBdcNotReadyTip/bdcUnHealthyTip
    type: String,
    default: 'bdcUnHealthyTip'
  }
})

const statusMap = computed(() => {
  const map = {
    default: DEFAULT_STATUS_MAP(),
    instance: SYSTEM_APPLICATION_STATUS(),
    bigDataCluster: BIG_DATA_CLUSTER_STATUS()
  }
  return map[props.type] || DEFAULT_STATUS_MAP()
})

const item = computed(() => {
  const status = props.status || 'unknown'
  const item = statusMap.value.find(item => toLower(item.value) === toLower(status)) || {}
  const style = `background-color: ${item.color || GRAY_COLOR}`
  const color = item.color || GRAY_COLOR
  const statusText = item.label || i18n.t('cluster.unknown')

  return { status, style, statusText, color }
})

const tooltipContent = computed(() => {
  const { sign, status, type } = props
  const statusText = item.value.statusText
  let ret = ''
  if (sign && type === 'bigDataCluster') {
    ret = getBdcStatusTip({ sign, status, statusText })
  }
  return ret
})
</script>

<template lang="pug">
.app-runtime-status.flex.items-center(v-if="status")
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
