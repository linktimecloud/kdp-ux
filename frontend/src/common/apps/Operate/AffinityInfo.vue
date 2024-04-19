<script setup>
import { computed, ref } from 'vue'
import i18n from '@/i18n'
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
  const { content } = props
  return !isEmpty(content) ? Object.keys(content).length : 0
})

const copyContent = () => {
  const content = JSON.stringify(props.content)
  copyToClipboard({ content })
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
    custom-class="application-affinity-info-dialog",
    :visible="dialogVisible",
    :title="`${$t('applications.affinity')}${$t('applications.appConfigInfo')}`",
    :append-to-body="true",
    width="60%",
    :close-on-click-modal="false",
    @close="dialogVisible = false"
  )
    .drawer-container
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
.application-affinity-info-dialog {
  .el-dialog__header {
    border: 1px solid $outline;
    padding: 15px !important;
    .el-dialog__title {
      font-weight: bold;
    }
    .el-dialog__headerbtn {
      top: 15px;
    }
  }
  .el-dialog__body {
    padding: 20px;
    .content-box {
      background: $bg_gray_G1;
      .format-json {
        max-height: 60vh;
        overflow: auto;
      }
    }
  }
}
</style>
