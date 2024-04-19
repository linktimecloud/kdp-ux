<script setup>
import { ref, computed } from 'vue'
import { isEmpty, get } from 'lodash'
import json2yaml from 'js-yaml'

import { copyToClipboard } from '@/utils/utils'
import { getAppKindResourcesDetailAPI } from '@/api/applications'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  cls: {
    type: [String, Array, Boolean],
    default: ''
  },
  type: String,
  title: String
})

const drawerVisible = ref(false)
const processing = ref(false)
const content = ref({})

const yamlContent = computed(() => {
  return json2yaml.dump(content.value, { lineWidth: -1 })
})

const getYaml = async () => {
  const { namespace: resNs, pod: resName, kind: resKind, apiVersion: resAPIVersion, appName } = props.data
  const resourcesMap = {
    pod: {
      resourceAPI: getAppKindResourcesDetailAPI,
      data: {
        resNs,
        resName,
        resKind,
        resAPIVersion
      }
    }
  }
  const resourceAPI = get(resourcesMap, `${props.type}.resourceAPI`)
  if (!resourceAPI) return

  const params = get(resourcesMap, `${props.type}.data`)
  processing.value = true
  await resourceAPI({ appName, params }).then((rsp) => {
    content.value = get(rsp, 'data') || get(rsp, 'data.data') || {}
  }).finally(() => {
    processing.value = false
  })
}

const handleOpen = () => {
  // 当类型为'onlyShow'的时候，表示直接通过prop得到的data进行展示，不需要重新发请求去拿数据
  if (props.type === 'onlyShow') {
    content.value = props.data
  } else {
    getYaml()
  }
}
</script>

<template lang="pug">
.application-show-yaml.inline-block
  el-button(
    type="primary",
    link
    :class="cls",
    @click.prevent="drawerVisible = true"
  )
    slot
      span {{ $t('common.detail') }}
  el-drawer(
    v-model="drawerVisible",
    class="application-show-yaml-drawer",
    :title="title",
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false",
    @open="handleOpen"
  )
    .drawer-container
      el-button.mb-2(size="small", :disabled="isEmpty(content)", @click="copyToClipboard({ content: yamlContent })")
        i.remix.ri-file-copy-line
        span {{ $t('common.copy') }}
      .content-box(v-loading="processing")
        pre.content.p-2 {{ yamlContent }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.application-show-yaml-drawer {
  .el-drawer__body {
    padding: 15px;
    .content {
      max-height: calc(100vh - 150px);
      overflow: auto;
      background: $bg_gray_G1;
    }
  }
}
</style>
