<script>
import CommonTips from '@/common/TipsIcon.vue'

export default {
  name: 'collapse-layout',
  props: {
    data: {
      type: Object,
      required: true
    },
    filter: Object,
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
.collapse-layout(class="dashboard-type")
  .collapse-header.flex.justify-between.items-center.mb-2.shadow-box
    .flex.items-center
      .flex.cursor-pointer(@click="isExpand = !isExpand")
        i.remix.expand-icon(:class="isExpand ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'")
        .title.ml-2 {{ data.label }}
      CommonTips.ml-1(
        v-if="tipsData",
        v-bind="tipsData"
      )
    .header-filter(v-show="isExpand")
      slot(name="headerRight")
    el-button.mr-2(v-if="data.link")
      a(:href="data.link.url", target="_blank")
        i.remix.ri-external-link-line
        span {{ data.link.label }}
  .collapse-content.h-full(:class="{ 'is-hidden': !isExpand }")
    slot(v-if="isExpand")
</template>

<style lang="scss">
.collapse-layout {
  .collapse-header {
    min-height: 46px;
    color: #262626;
    overflow: hidden;
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

  &.dashboard-type {
    .collapse-header {
      background: #fff;
      border-radius: 4px;
      padding-left: 8px;
    }
  }
}
</style>
