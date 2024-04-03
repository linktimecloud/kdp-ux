<script>
import { get, isEmpty } from 'lodash'
import Ajax from '@/api/ajax'

import SchemaForm from '@/components/schemaForm'
import EmptyHolder from '@/components/empty'
import JsonTree from '@/components/json'
import { copyToClipboard } from '@/utils/document'

export default {
  name: 'view-context-settings-button',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'applicationSetting'
    }
  },
  data () {
    return {
      processing: {
        schema: false,
        form: false
      },
      form: {},
      schema: {},
      drawerVisible: false,
      isCode: false
    }
  },
  computed: {
    bdc () {
      return get(this.data, 'bdc.name') || ''
    },
    actionTitle () {
      return `${this.$t('common.view')}${this.currentTypeResource.title}：${get(this.data, 'name')}`
    },
    origin () {
      const origin = get(this.data, 'origin')
      return this.$te(`cluster.contextSettingOrigin.${origin}`) ? this.$t(`cluster.contextSettingOrigin.${origin}`) : ''
    },
    currentTypeResource () {
      return {
        applicationSetting: {
          title: this.$t('applications.applicationUsedSettings'),
          form: 'GET_BDC_CONTEXT_SETTING',
          schema: 'GET_BDC_CONTEXT_SETTING_DEFINITION_SCHEMA'
        },
        applicationSecret: {
          title: this.$t('applications.applicationSecret'),
          schema: 'GET_BDC_CONTEXT_SECRET_DEFINITION_SCHEMA',
          form: 'GET_BDC_CONTEXT_SECRET'
        }
      }[this.type]
    }
  },
  methods: {
    isEmpty,
    getSchema () {
      const self = this
      const defType = get(self.data, 'type')
      const { bdc: bdcName } = this
      return defType && new Ajax({
        resource: {
          name: self.currentTypeResource.schema,
          sets: {
            bdcName,
            defType
          }
        },
        before () {
          self.schema = {}
          self.processing.schema = true
        },
        complete () {
          self.processing.schema = false
        },
        success (rsp = {}) {
          self.schema = get(rsp, 'data') || {}
        }
      }).fetch()
    },
    getForm () {
      const self = this
      const name = get(this.data, 'metaName') || ''
      return name && new Ajax({
        resource: {
          name: self.currentTypeResource.form,
          sets: {
            name
          }
        },
        before () {
          self.form = {}
          self.processing.form = true
        },
        complete () {
          self.processing.form = false
        },
        success (rsp = {}) {
          self.form = get(rsp, 'data') || {}
        }
      }).fetch()
    },
    openDrawer () {
      this.drawerVisible = true
      this.isCode = false
      this.getSchema()
      this.getForm()
    },
    copyContent () {
      if (!isEmpty(this.form.properties)) {
        const content = JSON.stringify(this.form.properties)
        copyToClipboard(content)
        this.$message({
          type: 'success',
          message: this.$t('common.copySuccess')
        })
      }
    }
  },
  components: {
    EmptyHolder,
    SchemaForm,
    JsonTree
  }
}
</script>

<template lang="pug">
.view-context-settings-button
  span.cursor-pointer.text-primary(
    @click="openDrawer"
  )
    slot
  el-drawer(
    :title="actionTitle",
    :visible="drawerVisible",
    direction="rtl",
    size="50%",
    :wrapperClosable="false",
    :append-to-body="true",
    custom-class="view-context-settings-drawer",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container
      .d-flex.mb-3
        .d-flex.mr-3
          .label.mr-1 {{ $t('menu.bigDataCluster') }}:
          .value {{ bdc | holder('-') }}
        template(v-if="type === 'applicationSetting'")
          .d-flex.mr-3
            .label.mr-1 {{ $t('common.origin') }}:
            .value {{ origin | holder('-') }}
          .d-flex.mr-3
            .label.mr-1 {{ $t('common.settingsType') }}:
            .value {{ form.type | holder('-') }}
      div.d-flex.justify-content-between.align-items-center.mb-2
        span {{ `${$t('common.key')}${$t('common.value')}` }}
        .d-flex.align-items-center(v-if="!isEmpty(schema)")
          el-button(v-if="isCode", type="default", size="mini", @click="copyContent")
            i.remix.ri-file-copy-2-line
            span {{ $t('common.copy') }}
          el-button(type="default", size="mini", @click="isCode = !isCode")
            i.remix.mr-0(:class="isCode ? 'ri-computer-line' : 'ri-code-line'")
      template(v-loading="processing.schema || processing.form")
        SchemaForm.p-2.border.rounded(
          v-if="!isEmpty(schema.JSONSchema) && !isCode",
          :schema="schema.JSONSchema",
          :uiSchema="schema.UISchema",
          :value="form.properties",
          :optionProps="{ disabled: true }"
        )
        JsonTree.config-data.bg-gray.border.rounded.p-2(v-else-if="!isEmpty(form.properties) && isCode", :data="form.properties")
        EmptyHolder(
          v-else,
          :full="false",
          :height="300"
        )
    .el-drawer__footer.d-flex.justify-content-end
      el-button.mr-2(@click="drawerVisible = false") {{ $t('common.cancel') }}
</template>
