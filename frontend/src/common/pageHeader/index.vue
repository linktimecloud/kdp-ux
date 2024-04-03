<script>
/**
 * Import store helpers
 */

import HelperTip from '@/common/helper'
import CommonTips from '@/common/tips'

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
    target: {
      type: String,
      default: ''
    },
    left: {
      type: Number,
      default: 8
    },
    right: {
      type: Number,
      default: 4
    },
    isShowBack: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cls () {
      const left = `col-${this.left}`
      const right = `col-${this.right}`
      return {
        left,
        right
      }
    }
  },
  components: {
    HelperTip,
    CommonTips
  }
}
</script>

<template lang="pug">
.pageheader__container.p-3.bg-white.mb-3(v-if="Object.keys(data).length")
  .d-flex.row
    .pageheader-col.left(:class="cls.left")
      .pageheader.mb-0.p-0.bg-white.d-flex
        i.ri-arrow-left-line.cursor-pointer.mr-2(
          v-if="isShowBack",
          @click="$emit('toBack')"
        )
        .d-flex.align-items-center
          .pageheader_title {{ data.content || $t(data.text) }}
          .d-flex.align-items-center
            CommonTips.ml-1(
              v-if="data.tips",
              :name="data.tips"
            )
            HelperTip(
              :name="tip",
              :target="target",
              v-show="tip"
            )
            span.ml-3.sub-title.text-gray(v-if="data.subTitle") {{ data.subTitle }}
          slot(name="leftAfter")
    .pageheader-col.right(:class="cls.right")
      .pageheader__slot.float-right
        slot
  slot(name="nextRow")
</template>

<style lang="scss">
@import '~@/root.scss';
.pageheader__container {
  margin: -1rem -1rem 0;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.04);
  .pageheader,
  .pageheader_title {
    color: $font_high;
    font-size: 24px;
    font-weight: 500;
    .common-tips {
      .text-icon-tip {
        margin-bottom: 6px;
      }
    }
  }
  .sub-title {
    font-size: 14px;
    font-weight: 400;
  }
  .pageheader__slot {
    line-height: 30px;
    margin-bottom: 0;
  }
}
</style>
