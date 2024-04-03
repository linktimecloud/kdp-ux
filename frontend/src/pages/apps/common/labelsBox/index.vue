<script>
import { get, isEmpty } from 'lodash'
import { copyToClipboard } from '@/utils/document'

export default {
  name: 'app-labels-box',
  props: {
    data: Object,
    sign: String
  },
  computed: {
    options () {
      return [
        {
          key: 'labels',
          icon: 'ri-price-tag-line',
          text: `${this.$t('applications.labels')}${this.$t('common.info')}`
        },
        {
          key: 'annotations',
          icon: 'ri-draft-line',
          text: `${this.$t('applications.annotations')}${this.$t('common.info')}`
        },
        {
          key: 'labelSelector'
        },
        {
          key: 'nodeSelector'
        },
        {
          key: 'secrets',
          icon: 'ri-lock-2-line',
          text: `Secrets${this.$t('common.info')}`
        }
      ].find(item => item.key === this.sign)
    },
    labelData () {
      const obj = get(this.data, this.options.key) || {}
      let ret = []
      if (!isEmpty(obj)) {
        ret = Object.keys(obj).map(key => {
          return obj[key] ? `${key}:${obj[key]}` : key
        })
      }
      return ret
    },
    labelLength () {
      return this.labelData.length || 0
    }
  },
  methods: {
    copyContent (label) {
      if (label) {
        copyToClipboard(label)
        this.$message({
          type: 'success',
          message: this.$t('common.copySuccess')
        })
      }
    }
  }
}
</script>

<template lang="pug">
.app-labels-box.d-flex.align-items-center
  span.mr-1 {{ labelLength }} {{ $t('applications.number') }}
  el-tooltip(
    :key="'tooltip' + labelLength",
    popper-class="app-labels-button-tooltip",
    placement="bottom",
    effect="light",
    :open-delay="200",
    trigger="hover"
  )
    .d-flex.flex-wrap.content-box(slot="content")
      el-tag.mr-2.mt-1(v-for="(label, idx) in labelData", :key="idx")
        el-tooltip(
          popper-class="app-labels-item-tooltip",
          placement="right",
          effect="light",
          :open-delay="200",
        )
          .item-content-box(slot="content") {{ label }}
          .label-value.d-block.text-ellipsis.cursor-pointer(@dblclick="copyContent(label)") {{ label }}
    .labels-info-btn.cursor-pointer(v-if="labelLength")
      i.remix.mr-1(:class="options.icon || 'ri-file-info-line'")
      span {{ options.text || `${this.$t('common.more')}${this.$t('common.info')}` }}
</template>

<style lang="scss">
@import '~@/root.scss';

.app-labels-button-tooltip {
  max-height: 300px;
  max-width: 300px;
  .content-box {
    max-height: 270px;
    overflow-y: auto;
  }
  .label-value {
    max-width: 250px;
  }
}
.app-labels-item-tooltip {
  max-height: 300px;
  .item-content-box {
    max-height: 270px;
    line-height: 1.5;
    overflow-y: auto;
  }
}
.labels-info-btn {
  &:hover {
    color: $primary_color;
  }
}
</style>
