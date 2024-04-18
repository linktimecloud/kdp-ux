<script setup>
import { computed } from 'vue'
import { ElNotification } from 'element-plus'
import { isEmpty } from 'lodash'
import i18n from '@/i18n'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import PATTERNS from '@/utils/patterns'

import { copyToClipboard } from '@/utils/document'

const props = defineProps({
  data: {
    type: [Object, Array],
    default: () => ({})
  },
  jsonFormatOptions: {
    type: Object,
    default: () => ({})
  },
  enableCopy: {
    type: Boolean,
    default: false
  }
})

const options = computed(() => {
  return { showLine: false, ...props.jsonFormatOptions }
})

const calculateValueStyle = computed(() => props.jsonFormatOptions.calculateValueStyle || (() => ({})))

const getUrlValue = (val) => {
  let ret = ''
  try {
    ret = JSON.parse(val)
  } catch (e) {
    console.log(e)
  }
  return PATTERNS.url.test(ret) ? ret : ''
}

const handleCopy = () => {
  copyToClipboard(JSON.stringify(props.data))
  ElNotification({
    type: 'success',
    message: i18n.t('common.copySuccess')
  })
}

</script>

<template lang="pug">
.format-json
  el-button.mb-2(
    v-if="enableCopy",
    size="small",
    :disabled="isEmpty(data)",
    @click="handleCopy"
  )
    i.remix.ri-file-copy-line
    span {{ i18n.t('common.copy') }}
  VueJsonPretty(:data="data", v-bind="options")
    template(#renderNodeKey="{ defaultKey }")
      span {{ defaultKey }}
    template(#renderNodeValue="{ node, defaultValue }")
      a(
        v-if="getUrlValue(defaultValue)",
        :href="getUrlValue(defaultValue)",
        target="_blank"
      ) {{ defaultValue }}

      span(
        v-else,
        :style="calculateValueStyle({ node, defaultValue, data })",
      ) {{ defaultValue }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.format-json {
  position: relative;
  .vjs-key {
    word-break: break-word;
    max-width: 50%;
    color: $font;
    & + span {
      flex: 1;
    }
  }
  .vjs-tree-node:hover {
    background-color: $bg_primary;
  }
}
</style>
