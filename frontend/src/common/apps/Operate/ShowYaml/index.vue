<script>
import Ajax from '@/api/ajax'
import { isEmpty, get } from 'lodash'
import { copyToClipboard } from '@/utils/document'
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
          resource: {
            name: 'GET_APP_KIND_RESOURCES_DETAIL',
            sets: {
              appName: appName
            }
          },
          data: {
            resNs,
            resName,
            resKind,
            resAPIVersion
          }
        }
      }
      const resource = get(resourcesMap, `${this.type}.resource`)
      const data = get(resourcesMap, `${this.type}.data`)
      !isEmpty(resource) && new Ajax({
        resource,
        data,
        success (rsp) {
          self.content = get(rsp, 'data') || get(rsp, 'data.data') || {}
        },
        before () {
          self.content = {}
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
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
    type="text"
    :class="cls",
    @click.prevent="drawerVisible = true"
  )
    slot
      span {{ $t('common.detail') }}
  el-drawer(
    custom-class="application-show-yaml-drawer",
    :visible="drawerVisible",
    :title="title",
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container
      el-button.mb-2(type="default", size="mini", :disabled="isEmpty(content)", @click="copyContent")
        i.remix.ri-file-copy-line
        span {{ $t('common.copy') }}
      .content-box(v-loading="processing")
        pre.content.p-2 {{ yamlContent }}
</template>

<style lang="scss">
@import '~@/root.scss';

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
