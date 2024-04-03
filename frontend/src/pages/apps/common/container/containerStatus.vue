<script>
import { get } from 'lodash'

import { GREEN_COLOR, DANGER_COLOR } from '@/constant/color'

export default {
  name: 'instance-container-status',
  props: {
    containers: {
      type: Array,
      required: true
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getStyle (item) {
      return {
        backgroundColor: get(item, 'status.ready') ? GREEN_COLOR : DANGER_COLOR
      }
    },
    getLabel (item) {
      return get(item, 'status.ready') ? this.$t('applications.runtimeStatus.normal') : this.$t('applications.runtimeStatus.abnormal')
    }
  }
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
      .container-item.d-flex.justify-content-between.my-1(
        v-for="item in containers",
        :key="item.name"
      )
        span {{ item.name }}
        .d-flex.ml-3.align-items-center
          .status-color.mr-1(:style="getStyle(item)")
          span {{ getLabel(item) }}
    .container-box.d-flex.align-items-center.cursor-pointer.flex-wrap(slot="reference", @click="$emit('clickStatus')")
      template(v-for="item in containers")
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
