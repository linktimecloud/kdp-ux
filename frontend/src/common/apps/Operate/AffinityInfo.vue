<script setup>
import { computed, ref } from 'vue'
import { isEmpty, cloneDeep } from 'lodash'

import { copyToClipboard } from '@/utils/utils'

import JsonTree from '@/components/json/FormatJson.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  showLabel: {
    type: Boolean,
    default: false
  },
  title: String
})

const dialogVisible = ref(false)

const content = computed(() => {
  const { data } = props
  const obj = cloneDeep(data)
  if (!isEmpty(data)) {
    Object.keys(data).forEach(key => {
      if (isEmpty(data[key])) {
        delete obj[key]
      }
    })
  }
  return obj
})

const label = computed(() => {
  return !isEmpty(content.value) ? Object.keys(content.value).length : 0
})

const copyContent = () => {
  const ret = JSON.stringify(content.value)
  copyToClipboard({ content: ret })
}
</script>

<template lang="pug">
.application-affinity-info.flex
  span.mr-2 {{ label }}
  .d-block.cursor-pointer.affinity-btn(v-if="label", @click="dialogVisible = true")
    slot
      i.remix.ri-settings-3-line.mr-1
      span {{ $t('applications.appConfigInfo') }}
  el-dialog(
    v-model="dialogVisible",
    :title="`${$t('applications.affinity')}${$t('applications.appConfigInfo')}`",
    :append-to-body="true",
    width="60%",
    :close-on-click-modal="false",
    @close="dialogVisible = false"
  )
    .drawer-container(v-if="dialogVisible")
      .flex.justify-between.items-center.flex-wrap.mb-2
        span {{ title }}
        el-button(type="default", size="small", :disabled="isEmpty(content)", @click="copyContent")
          i.remix.ri-file-copy-line
          span {{ $t('common.copy') }}
      .content-box.p-2
        JsonTree(:data="content")
</template>

<style lang="scss">
@import '@/assets/root.scss';
.application-affinity-info {
  .affinity-btn {
    &:hover {
      color: $primary_color;
    }
  }
}
</style>
