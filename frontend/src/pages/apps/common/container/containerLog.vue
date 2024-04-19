<script setup>
import { ref, computed, nextTick } from 'vue'
import { get, isEmpty } from 'lodash'
import { AnsiUp } from 'ansi_up'
import i18n from '@/i18n'

import { timeformat } from '@/utils/utils'
import { saveAs } from 'file-saver'
import { getAppPodContainerLogsAPI } from '@/api/applications'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  podData: {
    type: Object,
    required: true
  },
  defaultContainer: {
    type: String,
    default: ''
  }
})

const drawerVisible = ref(false)
const containerLogs = ref('')
const processing = ref(false)
const lineNum = ref(100)
const containerName = ref('')

const containerList = computed(() => {
  return get(props.podData, 'containerStatuses', [])
})
const toLogviewer = computed(() => {
  const { podData: { pod, namespace, appName } } = props
  return {
    path: '/logviewer',
    query: {
      app: appName,
      pod,
      namespace,
      container: containerName.value,
      isOneHour: true
    }
  }
})
const title = computed(() => {
  return props.defaultContainer ? `${i18n.t('applications.container')}: ${props.defaultContainer}` : `Pod: ${props.podData.pod}`
})
const formatLogs = computed(() => {
  let logs = ''
  try {
    logs = atob(containerLogs.value)
  } catch (e) {
    console.log(e)
  }
  return logs
})
const coloredLogData = computed(() => {
  const ansiUp = new AnsiUp()
  return ansiUp.ansi_to_html(formatLogs.value)
})
const bdc = computed(() => {
  return get(route, 'query.bdc') || get(props.podData, 'bdc')
})

const handleOpen = () => {
  containerName.value = props.defaultContainer || get(props.podData, 'containerStatuses[0].name') || ''
  getContainerLogs()
  drawerVisible.value = true
}

const getContainerLogs = () => {
  const { podData: { podName, appName } } = props
  if (!appName || !podName || !containerName.value) return
  containerLogs.value = ''
  processing.value = true
  getAppPodContainerLogsAPI({
    appName,
    podName,
    containerName: containerName.value,
    data: {
      tail_lines: lineNum.value
    }
  }).then(rsp => {
    containerLogs.value = get(rsp, 'data.logs') || ''
    nextTick(() => {
      backBottom()
    })
  }).finally(() => {
    processing.value = false
  })
}

const scrollBox = ref(null)

const backBottom = () => {
  const box = scrollBox.value
  function returnBottom () {
    box.scrollBy(0, (box.scrollHeight - box.scrollTop) / 10)
    // Tips：正常情况如果容器滚动到了底部，那么 box.scrollHeight - box.clientHeight - box.scrollTop 的值应该是 0。但是实际情况中，由于浏览器像素渲染可能会导致误差，这个值可能会出现 0.5 的情况，所以这里做了一个容错处理，判断要大于 2。
    if (box.scrollHeight - box.clientHeight - box.scrollTop > 2) {
      setTimeout(() => { returnBottom() }, 30)
    }
  }
  box && returnBottom()
}

const downloadfile = () => {
  const fileName = `${props.podData?.pod}-${containerName.value}-${timeformat()}.log`
  const blob = new Blob([formatLogs.value])
  saveAs(blob, fileName)
}
const refresh = () => {
  lineNum.value = 100
  getContainerLogs()
}
const changeContainer = (val) => {
  containerName.value = val
  refresh()
}
</script>

<template lang="pug">
.pod-container-log
  el-button(type="primary", link, @click="handleOpen")
    slot
      span {{ $t('common.logs') }}
  el-drawer(
    v-model="drawerVisible",
    class="pod-container-log-dialog",
    direction="rtl",
    size="800px",
    :title="title",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .flex.justify-between.mb-3
      .flex.items-center
        span {{ $t('cluster.bdc') }}: {{ bdc }}
      router-link.view-log-link(:to="toLogviewer", target="_blank")
        el-button(type="primary", plain)
          i.remix.ri-external-link-line
          span {{ $t('common.more') }}{{ $t('common.logs') }}
    .flex.mb-3
      .prepend-input.items-center.flex.mr-2(v-if="!defaultContainer")
        .input-group-prepend.mr-2 {{ $t('applications.container') }}
        el-select.select-container(v-model="containerName", @change="changeContainer")
          el-option(
            v-for="item in containerList",
            :key="item.name",
            :value="item.name",
            :label="item.name"
          )
      .prepend-input.flex.items-center
        .input-group-prepend.mr-2 {{ $t('applications.getLatestData') }}
        el-select.select-line-num(v-model="lineNum", @change="getContainerLogs")
          el-option(
            v-for="item in [50, 100, 200, 500, 1000]",
            :key="item",
            :value="item",
            :label="item"
          )
      el-button.ml-2(@click="refresh")
        i.remix.mr-0.ri-refresh-line
      el-button(type='primary', @click="downloadfile") {{ $t('common.download') }}
    div(v-loading="processing")
      .log-box.p-2.small(v-if="!isEmpty(containerLogs)", ref="scrollBox", v-html="coloredLogData")
      EmptyHolder.m-4(v-else, :full="false")
</template>

<style lang="scss">
@import '@/assets/root.scss';

.pod-container-log-dialog {
  .el-drawer__body {
    padding-bottom: 1rem;
  }
  .log-box {
    white-space: pre-wrap;
    min-height: 100px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    background: $bg_gray_G1;
  }
  .select-container {
    width: 240px;
  }
  .select-line-num {
    width: 80px;
  }
}
</style>
