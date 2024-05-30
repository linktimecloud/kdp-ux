<script setup>
import { computed } from 'vue'
import i18n from '@/i18n'
import { get, isEmpty } from 'lodash'

import { copyToClipboard } from '@/utils/utils'

const props = defineProps({
  data: Object,
  sign: {
    type: String,
    default: 'labels'
  }
})

const options = computed(() => {
  return [
    {
      key: 'labels',
      icon: 'ri-price-tag-line',
      text: `${i18n.t('applications.labels')}${i18n.t('common.info')}`
    },
    {
      key: 'annotations',
      icon: 'ri-draft-line',
      text: `${i18n.t('applications.annotations')}${i18n.t('common.info')}`
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
      text: `Secrets${i18n.t('common.info')}`
    }
  ].find(item => item.key === props.sign)
})

const labelData = computed(() => {
  const obj = get(props.data, options.value.key) || {}
  let ret = []
  if (!isEmpty(obj)) {
    ret = Object.keys(obj).map(key => {
      return obj[key] ? `${key}:${obj[key]}` : key
    })
  }
  return ret
})

const labelLength = computed(() => {
  return labelData.value.length || 0
})
</script>

<template lang="pug">
.app-labels-box.flex.items-center
  span.mr-1 {{ labelLength }} {{ $t('applications.number') }}
  .tag-box(v-if="labelLength")
    el-popover(
      popper-class="app-labels-button-tooltip",
      placement="bottom",
      :show-after="200",
      :width="300"
    )
      .flex.flex-wrap.content-box
        el-tag.mr-2.mt-1(v-for="(label, idx) in labelData", :key="idx" type="info")
          el-tooltip(
            popper-class="app-labels-item-tooltip",
            placement="left",
            :open-delay="200",
            :content="label"
          )
            .label-value.d-block.text-ellipsis.cursor-pointer(@dblclick="copyToClipboard({ content: label })") {{ label }}
      template(#reference)
        .labels-info-btn.cursor-pointer(v-if="labelLength")
          i.remix.mr-1(:class="options.icon || 'ri-file-info-line'")
          span {{ options.text || `${i18n.t('common.more')}${i18n.t('common.info')}` }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

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
  max-width: 300px;
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
