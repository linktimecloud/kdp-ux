<script>
import CommonTips from '@/common/TipsIcon.vue'

/**
 * Component Settings
 */
export default {
  name: 'pageHeader',
  props: {
    data: {
      type: Object,
      default: null
    },
    tip: {
      type: String,
      default: ''
    },
    isShowBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CommonTips
  }
}
</script>

<template lang="pug">
.page-header-container.p-4.bg-white(v-if="Object.keys(data).length")
  .flex.justify-between.items-center
    .page-header-content.flex.items-center
      i.ri-arrow-left-line.cursor-pointer.mr-2(
        v-if="isShowBack",
        @click="$emit('toBack')"
      )
      .flex.items-center
        .page-header-title {{ data.content }}
        CommonTips.ml-1(
          v-if="data.tipsContent",
          :content="data.tipsContent"
        )
        span.ml-3.sub-title.text-gray(v-if="data.subTitle") {{ data.subTitle }}
        slot(name="leftAfter")
    .page-header-right
      slot
  slot(name="nextRow")
</template>

<style lang="scss">
@import '@/assets/root.scss';
.page-header-container {
  margin: -16px -16px 16px -16px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.04);
  .page-header-content {
    .ri-arrow-left-line {
      font-size: 20px;
    }
  }
  .page-header-title {
    color: $font_high;
    font-size: 24px;
    font-weight: 500;
  }
  .sub-title {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
