<script setup>
import i18n from '@/i18n'
import { get } from 'lodash'

import { GREEN_COLOR, DANGER_COLOR } from '@/constant/color'

defineProps({
  containers: {
    type: Array,
    required: true
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})

const getStyle = (item) => {
  return {
    backgroundColor: get(item, 'status.ready') ? GREEN_COLOR : DANGER_COLOR
  }
}

const getLabel = (item) => {
  return get(item, 'status.ready') ? i18n.t('applications.runtimeStatus.normal') : i18n.t('applications.runtimeStatus.abnormal')
}
</script>

<template lang="pug">
.instance-container-status
  el-popover(
    trigger="hover",
    popper-class="instance-container-popper",
    :disabled="showLabel"
  )
    .container-list
      .container-item.flex.justify-between.my-1(
        v-for="item in containers",
        :key="item.name"
      )
        span {{ item.name }}
        .flex.ml-3.items-center
          .status-color.mr-1(:style="getStyle(item)")
          span {{ getLabel(item) }}
    template.container-box.flex.items-center.cursor-pointer.flex-wrap(#reference)
      .flex.items-center(v-for="item in containers", :key="item.name")
        .status-color.mr-1.mb-1(
          :key="item.name",
          :style="getStyle(item)",
          :class="{ 'rounded-50': showLabel }"
        )
        span(v-if="showLabel") {{ getLabel(item) }}
</template>

<style lang="scss">
.instance-container-popper,
.instance-container-status {
  .status-color {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
    &.rounded-50 {
      border-radius: 50%;
    }
  }
}
</style>
