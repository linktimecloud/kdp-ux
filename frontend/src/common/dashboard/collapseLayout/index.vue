<script>
import CommonDashboardFilter from '@/common/dashboard/filter'
import CommonTips from '@/common/tips'

export default {
  name: 'collapse-layout',
  props: {
    data: {
      type: Object,
      required: true
    },
    tplList: Array,
    filter: Object,
    styleType: {
      type: String,
      default: 'dashboard' // dashboard/simple
    },
    defaultExpand: {
      type: Boolean,
      default: true
    },
    tipsData: Object,
    isSimple: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data () {
    return {
      isExpand: true
    }
  },
  computed: {
    list () {
      return this.tplList ? this.tplList.filter(item => !item.scopePanelName) : []
    }
  },
  components: {
    CommonDashboardFilter,
    CommonTips
  },
  mounted () {
    this.isExpand = this.defaultExpand
  }
}
</script>

<template lang="pug">
.collapse-layout(:class="`${styleType}-type`")
  .collapse-header.d-flex.justify-content-between.align-items-center.mb-2.shadow-box(v-if="showHeader", :class="{ 'is-simple': isSimple }")
    .d-flex.align-items-center
      .d-flex.cursor-pointer(v-if="!isSimple", @click="isExpand = !isExpand")
        i.remix.expand-icon(:class="isExpand ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'")
        .title.ml-2 {{ data.label }}
      span.font-weight-bold.collapse-header-label(v-else) {{ data.label }}
      CommonTips.ml-1(
        v-if="tipsData",
        v-bind="tipsData"
      )
    .header-filter(v-show="isExpand")
      CommonDashboardFilter(
        v-if="list && list.length",
        :tplList="list",
        :filter="filter",
        :actionBtns="[]",
        :clearable="false",
        :theme="theme"
      )
      slot(name="headerRight")
    el-button.mr-2(v-if="data.link")
      a(:href="data.link.url", target="_blank")
        i.remix.ri-external-link-line
        span {{ data.link.label }}
  .collapse-content.h-100(:class="{ 'is-hidden': !isExpand }")
    slot(v-if="isExpand")
</template>

<style lang="scss">
.collapse-layout {
  .collapse-header {
    min-height: 46px;
    color: #262626;
    overflow: hidden;
    &.is-simple {
      background: unset !important;
      padding: 0 !important;
      height: auto;
      box-shadow: none !important;
    }
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
