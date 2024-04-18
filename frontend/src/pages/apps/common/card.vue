<script>
import { get } from 'lodash'

import { versionCompare } from '@/utils/version'

import AppIcon from '@/common/apps/AppIcon.vue'

export default {
  name: 'AppListCard',
  components: {
    AppIcon
  },
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      required: true
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    disabled () {
      const data = this.data || {}
      return !!data.disabled
    },
    card () {
      const name = this.type
      const ret = this.data || {}
      const l = get(ret, 'version.latest')
      const c = get(ret, 'version.current')

      // TODO: 后续确认此功能是否已废弃
      const UPGRADE = false

      if (this.disabled) {
        ret.to = ''
      } else {
        if (UPGRADE) {
          ret.upgradable = versionCompare(l, c) > 0
        }
        ret.isnew = c === '0.0.0'
        ret.to = {
          name,
          query: {
            id: ret.id,
            appId: ret.appId,
            sub: ret.name,
            gname: ret.gname || ret.group || ''
          }
        }
        if (ret.isGroup) {
          ret.to.query.group = ret.id
        }
      }
      return ret
    }
  }
}
</script>

<template lang="pug">
.card.apps-list-card(
  v-if="data",
  :class="`${type}-list-card`"
)
  .card-body
    .img-wrapper.block-middle
      AppIcon(
        v-if="disabled || data.isnew",
        :id="data.id",
        :src="data.icon"
      )
      router-link(
        v-else,
        v-show="showIcon",
        :to="card.to"
      )
        AppIcon(:id="data.id", :src="data.icon")
    .content-wrapper
      h5
        el-tooltip(
          effect="dark",
          placement="top-start",
          class="card-header__text ellipsis",
          :open-delay="500",
          :content="`${$t('menu.'+ type)}: ${card.name}`"
        )
          span(v-if="disabled || data.isnew") {{ card.name }}
          router-link(
            v-else,
            :to="card.to"
          )
            span {{ card.name }}
      slot(
        :to="card.to",
        :upgradable="card.upgradable",
        :isnew="card.isnew",
        :disabled="disabled"
      )
</template>

<style lang="scss">
@import '@/assets/root.scss';
.apps-list-card {
  .card-body {
    display: flex;
    .img-wrapper {
      height: 80px;
      flex: 0 0 80px;
      margin-right: 15px;
    }
    .content-wrapper {
      flex: 1;
      max-width: calc(98% - 80px);
      h5 {
        margin-bottom: 25px;
        color: $font;
        font-weight: normal;
        word-break: break-all;
        max-width: 200px;
        a {
          color: $font;
          &:hover {
            color: #2a62c4;
          }
        }
      }
    }
  }
  .card-header__text {
    line-height: 24px;
    height: 24px;
  }
}
</style>
