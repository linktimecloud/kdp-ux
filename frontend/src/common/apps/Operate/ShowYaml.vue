<script>
import { isEmpty, get } from 'lodash'
import { copyToClipboard } from '@/utils/document'
import { getAppKindResourcesDetailAPI } from '@/api/applications'

import json2yaml from 'js-yaml'

export default {
  name: 'ApplicationShowYaml',
  props: {
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
  },
  data () {
    return {
      drawerVisible: false,
      processing: false,
      content: {}
    }
  },
  computed: {
    yamlContent () {
      return json2yaml.dump(this.content, { lineWidth: -1 })
    }
  },
  methods: {
    isEmpty,
    getYaml () {
      const { namespace: resNs, pod: resName, kind: resKind, apiVersion: resAPIVersion, appName } = this.data
      const self = this
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
      const resourceAPI = get(resourcesMap, `${this.type}.resourceAPI`)
      const data = get(resourcesMap, `${this.type}.data`)
      if (!resourceAPI) return

      self.processing = true
      resourceAPI({ appName, data }).then((rsp) => {
        self.content = get(rsp, 'data') || get(rsp, 'data.data') || {}
        self.processing = false
      }).catch(() => {
        self.processing = false
      })
    },
    copyContent () {
      if (!isEmpty(this.content)) {
        const content = json2yaml.dump(this.content, { lineWidth: -1 })
        copyToClipboard(content)
        this.$message({
          type: 'success',
          message: this.$t('common.copySuccess')
        })
      }
    }
  },
  watch: {
    drawerVisible (val) {
      if (val) {
        // 当类型为'onlyShow'的时候，表示直接通过prop得到的data进行展示，不需要重新发请求去拿数据
        if (this.type === 'onlyShow') {
          this.content = this.data
        } else {
          this.getYaml()
        }
      }
    }
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
    class="application-show-yaml-drawer",
    v-model="drawerVisible",
    :title="title",
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container
      el-button.mb-2(size="small", :disabled="isEmpty(content)", @click="copyContent")
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
