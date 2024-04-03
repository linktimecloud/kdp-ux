<script>
import { isEmpty, cloneDeep } from 'lodash'
import { copyToClipboard } from '@/utils/document'

import JsonTree from '@/components/json'

export default {
  name: 'ApplicationAffinityInfo',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    title: String
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {
    content () {
      const { data } = this
      const obj = cloneDeep(data)
      if (!isEmpty(data)) {
        Object.keys(data).forEach(key => {
          if (isEmpty(data[key])) {
            delete obj[key]
          }
        })
      }
      return obj
    },
    label () {
      const { content } = this
      return !isEmpty(content) ? Object.keys(content).length : 0
    }
  },
  components: {
    JsonTree
  },
  methods: {
    isEmpty,
    copyContent () {
      if (this.content) {
        const content = JSON.stringify(this.content)
        copyToClipboard(content)
        this.$message({
          type: 'success',
          message: this.$t('common.copySuccess')
        })
      }
    }
  }
}
</script>

<template lang="pug">
.application-affinity-info.d-flex
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
      .d-flex.justify-content-between.align-items-center.flex-wrap.mb-2
        span {{ title }}
        el-button(type="default", size="mini", :disabled="isEmpty(content)", @click="copyContent")
          i.remix.ri-file-copy-line
          span {{ $t('common.copy') }}
      .content-box.p-2
        JsonTree(:data="content")
</template>

<style lang="scss">
@import '~@/root.scss';
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
