<script>
import Ajax from '@/api/ajax'
import { isEmpty, get } from 'lodash'
import { copyToClipboard } from '@/utils/document'
import { DANGER_COLOR } from '@/constant/color'
import i18n from '@/i18n'

import JsonTree from '@/components/json'

export default {
  name: 'ApplicationStatusInfo',
  props: {
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
  },
  data () {
    return {
      i18n,
      drawerVisible: false,
      processing: false,
      content: {}
    }
  },
  methods: {
    isEmpty,
    getStatusInfo () {
      const self = this
      const { reqData } = this
      self.content = {}
      const resourcesMap = {
        commonAppResource: {
          name: 'GET_APP_KIND_RESOURCES_DETAIL',
          sets: {
            appName: this.data.name
          }
        },
        appDetail: {
          name: 'GET_APP_DETAIL',
          sets: {
            appName: this.data.name
          }
        }
      }
      const resource = resourcesMap[this.type]
      !isEmpty(resource) && new Ajax({
        resource,
        data: reqData,
        success (rsp) {
          self.content = get(rsp, 'data') || get(rsp, 'data.data') || {}
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    },
    copyContent () {
      if (this.content) {
        const content = JSON.stringify(this.content)
        copyToClipboard(content)
        this.$message({
          type: 'success',
          message: i18n.t('common.copySuccess')
        })
      }
    },
    calculateValueStyle ({ node, defaultValue, data }) {
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
  },
  components: {
    JsonTree
  },
  watch: {
    drawerVisible (val) {
      if (val) {
        if (!isEmpty(this.info)) {
          this.content = this.info
        } else {
          this.getStatusInfo()
        }
      }
    }
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
    custom-class="application-status-info-drawer",
    :visible="drawerVisible",
    direction="rtl",
    :title="drawerTitle || i18n.t('applications.statusInfo')",
    :size="drawerSize",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container
      .d-flex.justify-content-between.align-items-center.flex-wrap.mb-2
        span.font-weight-bold.mr-3 {{ title }}
        el-button(type="default", size="mini", :disabled="isEmpty(content)", @click="copyContent")
          i.remix.ri-file-copy-line
          span {{ i18n.t('common.copy') }}
      .content-box.p-2(v-loading="processing")
        JsonTree(:data="content", :jsonFormatOptions="{ calculateValueStyle }")
</template>

<style lang="scss">
@import '~@/root.scss';
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
      max-height: calc(100vh - 150px);
      overflow: auto;
      background: $bg_gray_G1;
    }
  }
}
</style>
