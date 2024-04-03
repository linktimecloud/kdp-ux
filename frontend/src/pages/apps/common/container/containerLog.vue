<script>
import { get, isEmpty } from 'lodash'
import { AnsiUp } from 'ansi_up'

import { timeformat } from '@/utils/utils'
import { saveAs } from 'file-saver'
import { getAppPodContainerLogsAPI } from '@/api/applications'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

export default {
  name: 'pod-container-log',
  props: {
    podData: {
      type: Object,
      required: true
    },
    defaultContainer: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      drawerVisible: false,
      containerLogs: '',
      processing: false,
      lineNum: 100,
      containerName: ''
    }
  },
  computed: {
    containerList () {
      return get(this.podData, 'containerStatuses', [])
    },
    toLogviewer () {
      const { podData: { pod, namespace, appName }, containerName } = this
      return {
        path: '/logviewer',
        query: {
          app: appName,
          pod,
          namespace,
          container: containerName,
          isOneHour: true
        }
      }
    },
    title () {
      return this.defaultContainer ? `${this.$t('applications.container')}: ${this.defaultContainer}` : `Pod: ${this.podData.pod}`
    },
    coloredLogData () {
      let logs = ''
      try {
        logs = atob(this.containerLogs)
      } catch (e) {}
      const ansiUp = new AnsiUp()
      return ansiUp.ansi_to_html(logs)
    },
    bdc () {
      return get(this.$route, 'query.bdc') || get(this.podData, 'bdc')
    }
  },
  methods: {
    isEmpty,
    handleOpen () {
      this.containerName = this.defaultContainer || get(this.podData, 'containerStatuses[0].name') || ''

      this.getContainerLogs()
      this.drawerVisible = true
    },
    getContainerLogs (line) {
      const self = this
      const { podData: { podName, appName }, lineNum, containerName } = self

      if (!appName || !podName || !containerName) return

      self.containerLogs = ''
      self.processing = true
      getAppPodContainerLogsAPI({
        appName,
        podName,
        containerName,
        data: {
          tail_lines: lineNum
        }
      }).then(rsp => {
        self.containerLogs = get(rsp, 'data.logs') || ''

        self.$nextTick(() => {
          self.backBottom()
        })
      }).finally(() => {
        self.processing = false
      })
    },
    backBottom () {
      const self = this
      const box = self.$refs.scrollBox
      function returnBottom () {
        box.scrollBy(0, (box.scrollHeight - box.scrollTop) / 10)
        // Tips：正常情况如果容器滚动到了底部，那么 box.scrollHeight - box.clientHeight - box.scrollTop 的值应该是 0。但是实际情况中，由于浏览器像素渲染可能会导致误差，这个值可能会出现 0.5 的情况，所以这里做了一个容错处理，判断要大于 2。
        if (box.scrollHeight - box.clientHeight - box.scrollTop > 2) {
          setTimeout(() => { returnBottom() }, 30)
        }
      }
      returnBottom()
    },
    downloadfile () {
      const { containerLogs, podData, containerName } = this
      const fileName = `${podData.pod}-${containerName}-${timeformat()}.log`

      const blob = new Blob([containerLogs])
      saveAs(blob, fileName)
    },
    refresh () {
      this.lineNum = 100
      this.getContainerLogs()
    },
    changeContainer (val) {
      this.containerName = val
      this.refresh()
    }
  },
  components: {
    EmptyHolder
  }
}
</script>

<template lang="pug">
.pod-container-log
  el-button(@click="handleOpen", type="primary", link)
    slot
      span {{ $t('common.logs') }}
  el-drawer(
    class="pod-container-log-dialog",
    v-model="drawerVisible",
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
      .prepend-input.flex.mr-2(v-if="!defaultContainer")
        .input-group-prepend {{ $t('applications.container') }}
        el-select.select-container(v-model="containerName", @change="changeContainer")
          el-option(
            v-for="item in containerList",
            :key="item.name",
            :value="item.name",
            :label="item.name"
          )
      .prepend-input.flex
        .input-group-prepend {{ $t('applications.getLatestData') }}
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
      .log-box.p-2.small(v-if="!isEmpty(containerLogs)", v-html="coloredLogData", ref="scrollBox")
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
