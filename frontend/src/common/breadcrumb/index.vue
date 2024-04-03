<script>
/**
 * Import store helpers
 */
import { mapGetters } from 'vuex'

import HelperTip from '@/common/helper'
import CommonTips from '@/common/tips'

/**
 * Component Settings
 */
export default {
  name: 'breadcrumb',
  props: {
    data: {
      type: Array,
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
    override: {
      type: Boolean,
      default: false
    },
    left: {
      type: Number,
      default: 6
    },
    right: {
      type: Number,
      default: 6
    },
    showHomePage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'route',
      'entry'
    ]),
    home () {
      const name = this.entry
      return {
        name,
        text: 'menu.home'
      }
    },
    sub () {
      return this.route.query.sub
    },
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
.breadcrumb__container.row
  .breadcrumb-col.left(:class="cls.left")
    .breadcrumb.mb-0.p-0(v-if="data", :class="{ 'header-title': data.length === 1 }")
      li.breadcrumb-item(
        v-if="showHomePage"
      )
        router-link(:to="home.name") {{ $t(home.text) }}
      li.breadcrumb-item(
        v-for="(item, i) in data",
        v-if="data",
        :key="i",
        :class="item.cls"
      )
        router-link(
          v-if="item.to || item.name",
          :to="item.to || item.name"
        ) {{ item.content || $t(item.text) }}
        span(v-else) {{ item.content || $t(item.text) }}
        CommonTips.ml-1(
          v-if="item.tips",
          :name="item.tips"
        )
      li.breadcrumb-item(v-if="sub && !override")
        span.sub {{ sub }}
      HelperTip(
        :name="tip",
        :target="target",
        v-show="tip"
      )
      slot(name="dropdown")
      slot(name="leftAfter")
  .breadcrumb-col.right(:class="cls.right")
    .breadcrumb__slot.float-right
      slot
</template>

<style lang="scss">
@import '~@/root.scss';
.breadcrumb__container {
  margin-bottom: 15px;
  .breadcrumb,
  .breadcrumb__slot {
    line-height: 30px;
    margin-bottom: 0;
    background: unset;
  }
  .breadcrumb-item {
    font-size: 14px;
    &,
    a {
      color: $font;
    }
    a {
      &:hover {
        color: #2a62c4;
      }

      &.router-link-exact-active {
        &,
        &:hover {
          color: $font;
          font-weight: normal;
          cursor: default;
        }
      }
    }
    &:last-of-type {
      a {
        color: #000 !important;
      }
    }
  }
  .breadcrumb {
    &.header-title {
      .breadcrumb-item {
        font-size: 20px !important;
      }
    }
  }
}
</style>
