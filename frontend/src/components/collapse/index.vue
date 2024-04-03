<script>
import CommonTips from '@/common/tips'
/**
 * Component Settings
 */
export default {
  name: 'collapse-item',
  props: {
    data: {
      type: Object,
      required: true
    },
    defaultExpand: {
      type: Boolean,
      default: true
    },
    tipsData: Object
  },
  data () {
    return {
      isExpand: true
    }
  },
  components: {
    CommonTips
  },
  mounted () {
    this.isExpand = this.defaultExpand
  }
}
</script>

<template lang="pug">
.collapse-item
  .collapse-header.d-flex.justify-content-between.align-items-center.mb-2.shadow-box
    .d-flex.align-items-center
      .d-flex.cursor-pointer.align-items-center(@click="isExpand = !isExpand")
        i.remix.expand-icon(:class="isExpand ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'")
        .title.ml-2 {{ data.label }}
        small.text-gray.ml-1 {{ data.subLabel }}
      CommonTips.ml-1(
        v-if="tipsData",
        v-bind="tipsData"
      )
    el-button.mr-2(v-if="data.link")
      a(:href="data.link.url", target="_blank")
        i.remix.ri-external-link-line
        span {{ data.link.label }}
  .collapse-content.h-100(:class="{ 'is-hidden': !isExpand }")
    slot(v-if="isExpand")
</template>
<style lang="scss">
.collapse-item {
  .collapse-header {
    min-height: 46px;
    color: #262626;
    overflow: hidden;
    padding-left: 8px;
    i.expand-icon {
      font-size: 18px;
    }
    .title {
      font-weight: 500;
      font-size: 18px;
    }
    .common-search-box {
      margin-bottom: 0 !important;
    }
    .header-filter {
      max-width: calc(100% - 190px);
    }
  }
  .collapse-content {
    transition: all 0.3s;
    &.is-hidden {
      height: 0 !important;
      overflow: hidden;
    }
  }
}
</style>
