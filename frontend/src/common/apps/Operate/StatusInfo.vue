<script setup>
import { ref } from 'vue'
import i18n from '@/i18n'
import { isEmpty, get } from 'lodash'

import { DANGER_COLOR } from '@/constant/color'
import { getAppKindResourcesDetailAPI, getAppDetailAPI } from '@/api/applications'

import JsonTree from '@/components/json/FormatJson.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  reqData: {
    type: Object,
    default: () => ({})
  },
  cls: {
    type: [String, Array, Boolean],
    default: ''
  },
  type: String,
  title: String,
  info: {
    type: Object,
    default: () => ({})
  },
  drawerSize: {
    type: String,
    default: '30%'
  },
  drawerTitle: {
    type: String,
    default: ''
  }
})

const drawerVisible = ref(false)
const processing = ref(false)
const content = ref({})

const getStatusInfo = async () => {
  const { reqData, data, type } = props
  content.value = {}
  const resourcesMap = {
    commonAppResource: {
      name: getAppKindResourcesDetailAPI,
      params: {
        appName: data.name
      }
    },
    appDetail: {
      name: getAppDetailAPI,
      params: {
        appName: data.name
      }
    }
  }
  const apiName = get(resourcesMap, `${type}.name`)
  const params = get(resourcesMap, `${type}.params`) || {}
  if (apiName) {
    processing.value = true
    await apiName({ ...params, params: reqData }).then((rsp) => {
      content.value = get(rsp, 'data') || get(rsp, 'data.data') || {}
    })
    processing.value = false
  }
}

const calculateValueStyle = ({ node, defaultValue, data }) => {
  const { path, key } = node
  const parent = get(data, path.replace(/^root\.|\.[^.]*$/g, '')) || {}
  const ret = {}

  const errorTextMap = ['False', 'false', 'failed', false, 'CreateContainerConfigError', 'CrashLoopBackOff', 'ContainersNotReady']
  if (key === 'message') {
    const errorVal = parent.status ?? parent.phase ?? parent.healthy ?? parent.reason
    const highlightError = errorTextMap.includes(errorVal)
    if (highlightError) {
      ret.color = DANGER_COLOR
    }
  }

  if (key === 'healthy') {
    if (errorTextMap.includes(defaultValue)) {
      ret.color = DANGER_COLOR
    }
  }
  return ret
}

const handleOpen = () => {
  if (!isEmpty(props.info)) {
    content.value = props.info
  } else {
    getStatusInfo()
  }
}

</script>

<template lang="pug">
.application-status-info.inline-block(v-if="data.status")
  .d-block.cursor-pointer.status-btn(@click="drawerVisible = true")
    slot
      i.remix.ri-file-info-line.mr-1
      span {{ i18n.t('applications.statusInfo') }}
  el-drawer(
    v-model="drawerVisible",
    class="application-status-info-drawer",
    direction="rtl",
    :title="drawerTitle || i18n.t('applications.statusInfo')",
    :size="drawerSize",
    :append-to-body="true",
    :before-close="() => drawerVisible = false",
    @open="handleOpen"
  )
    .drawer-container(v-if="drawerVisible")
      .flex.justify-between.items-center.flex-wrap.mb-2
        span.font-bold.mr-3 {{ title }}
      .content-box.p-2(v-loading="processing")
        JsonTree(
          :data="content",
          :json-format-options="{ calculateValueStyle }",
          :enable-copy="true"
        )
</template>

<style lang="scss">
@import '@/assets/root.scss';
.application-status-info {
  .status-btn {
    &:hover {
      color: $primary_color;
    }
  }
}
.application-status-info-drawer {
  .el-drawer__body {
    padding: 15px;
    .content-box {
      max-height: calc(100vh - 120px);
      overflow: auto;
      background: $bg_gray_G1;
    }
  }
}
</style>
