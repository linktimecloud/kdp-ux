<script>
import { isEmpty, get, some, cloneDeep } from 'lodash'
import Ajax from '@/api/ajax'

import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'

import ReasonButton from '@/common/reasonButton'
import LabelsBox from '@/pages/apps/common/labelsBox'
import BdcAppStatus from '@/common/cluster/bdcStatus'
import SchemaForm from '@/components/schemaForm'
import EmptyHolder from '@/components/empty'

export default {
  name: 'update-config-button',
  props: {
    btnType: {
      type: String,
      default: 'text'
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      drawerVisible: false,
      configData: {},
      processing: {
        fetch: false,
        update: false,
        schema: false
      },
      bdcInfo: {},
      schema: {},
      schemaForm: {},
      valid: false
    }
  },
  computed: {
    name () {
      return get(this.data, 'name')
    },
    reqData () {
      const { schemaForm, name } = this
      return {
        properties: {
          ...schemaForm
        },
        appendWebhook: true,
        processInfo: {
          handle: 'update',
          category: 'application',
          name
        }
      }
    },
    updateReason () {
      return this.name ? '' : this.$t('applications.disableUpdateRenderTips')
    },
    basicData () {
      const { configData, data } = this
      return {
        appCatalog: get(data, 'catalog'),
        appForm: get(configData, 'appFormName'),
        appName: get(configData, 'appRuntimeName'),
        labels: get(configData, 'labels'),
        bdc: get(configData, 'bdc.name'),
        bdcStatus: get(configData, 'bdc.status'),
        annotations: get(configData, 'annotations')
      }
    },
    basicMap () {
      return [
        {
          key: 'bdc',
          label: this.$t('menu.bigDataCluster')
        },
        {
          key: 'appCatalog',
          label: this.$t('applications.fromCatalog')
        },
        {
          key: 'appForm',
          label: this.$t('applications.fromApp')
        },
        {
          key: 'appName',
          label: this.$t('applications.instance')
        }
      ]
    },
    saveReason () {
      let ret = ''
      if (!this.valid) ret = this.$t('quota.invalidFormTips')
      if (some(this.processing, Boolean)) ret = this.$t('common.processing')
      return ret
    }
  },
  methods: {
    get,
    isEmpty,
    async handleOpen () {
      this.schemaForm = {}
      this.getAppConfig()
      this.drawerVisible = true
    },
    updateAppConfig () {
      const self = this
      const { name: appName, reqData } = self

      const resource = {
        name: 'PUT_APPLICATION',
        sets: { appName }
      }
      appName && new Ajax({
        resource,
        data: reqData,
        success (rsp = {}) {
          const id = get(rsp, 'data.pid')
          id && processRedirect({
            id,
            refresh () {
              toast.log(
                self.$t('common.actionSuccess'),
                { type: 'success' }
              )
              self.getAppConfig()
            },
            direct: false
          })

          self.drawerVisible = false
        },
        before () {
          self.processing.update = true
        },
        complete () {
          self.processing.update = false
        },
        loading: true
      }).fetch()
    },
    getAppConfig () {
      const { name: appName } = this
      const self = this

      new Ajax({
        resource: {
          name: 'GET_APPLICATION',
          sets: {
            appName
          }
        },
        success (rsp) {
          self.configData = get(rsp, 'data') || {}
          self.schemaForm = get(rsp, 'data.properties') || {}
          self.getSchema()
        },
        before () {
          self.configData = {}
          self.schemaForm = {}
          self.processing.fetch = true
        },
        complete () {
          self.processing.fetch = false
        }
      }).fetch()
    },
    getSchema () {
      const self = this
      const defType = get(this.configData, 'appTemplateType')
      const { data: { bdc: bdcName } } = this
      bdcName && defType && new Ajax({
        resource: {
          name: 'GET_BDC_APPLICATION_DEFINITION_SCHEMA',
          sets: { defType, bdcName }
        },
        success (rsp = {}) {
          self.schema = cloneDeep(get(rsp, 'data')) || {}
        },
        before () {
          self.processing.schema = true
        },
        complete () {
          self.processing.schema = false
        }
      }).fetch()
    }
  },
  components: {
    ReasonButton,
    LabelsBox,
    BdcAppStatus,
    SchemaForm,
    EmptyHolder
  }
}
</script>

<template lang="pug">
.update-config-button
  ReasonButton(
    :type="btnType",
    :reason="updateReason",
    @click="handleOpen"
  ) {{ $t('common.update') }}
  el-drawer(
    custom-class="update-config-drawer",
    :title="`${$t('common.update')}: ${name}`",
    :visible="drawerVisible",
    direction="rtl",
    size="50%",
    :wrapperClosable="false",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container(v-loading="processing.fetch")
      .info-box.rounded.mb-3
        .title.font-weight-bold.mb-3 {{ $t('applications.appBasicInfo') }}
        .d-flex.flex-wrap
          .d-flex.mb-2.mr-3(v-for="({ key, label }) in basicMap", :key="key")
            span {{ label }}：
            .d-flex(v-if="key === 'bdc' && basicData?.bdc")
              span.mr-1 {{ basicData.bdc }}
              BdcAppStatus(:status="basicData?.status", sign="appBdcNotReadyTip")
            span(v-else-if="key === 'appCatalog'")
              router-link(
                v-if="basicData.appCatalog",
                :to="`/catalogHomepage/${basicData.appCatalog}`",
                target="_blank"
              )
                span {{ basicData.appCatalog }}
                i.remix.ri-external-link-line.ml-1
              span.text-gray(v-else) {{ $t('common.noData') }}
            span(v-else-if="key === 'appForm'")
              router-link(
                v-if="basicData.appName",
                :to="{ path: `/catalogHomepage/${basicData.appCatalog}`, query: { sub: basicData.appForm } }",
                target="_blank"
              )
                span {{ basicData.appForm }}
                i.remix.ri-external-link-line.ml-1
              span.text-gray(v-else) {{ $t('common.noData') }}
            span(v-else) {{ basicData[key] | noData }}
          .d-flex.align-item-center.mb-2.mr-3(v-for="key in ['labels', 'annotations']", :key="key")
            span {{ $t(`applications.${key}`) }}：
            LabelsBox(:sign="key", :data="basicData")
      .config-box.border.rounded.p-3(v-loading="processing.schema || processing.fetch")
        SchemaForm(
          v-if="!isEmpty(schema.JSONSchema) && !isEmpty(schemaForm)",
          v-model="schemaForm",
          :schema="schema.JSONSchema",
          :uiSchema="schema.UISchema"
          :optionProps="{ labelPosition: 'right', labelWidth: '160px' }",
          :valid.sync="valid"
        )
        EmptyHolder(
          v-else,
          :height="300"
        )
    .el-drawer__footer.d-flex.justify-content-end
      el-button.mr-2(@click="drawerVisible = false") {{ $t('common.cancel') }}
      ReasonButton(
        type="primary",
        :reason="saveReason"
        @click="updateAppConfig"
      ) {{ $t('common.confirm') }}
</template>

<style lang="scss">
@import '~@/root.scss';

.update-config-drawer {
  .drawer-container {
    .collapse-layout .collapse-header {
      margin-bottom: 0 !important;
      .title,
      i {
        font-size: 14px;
      }
    }
    .el-form-item__label {
      padding: 0;
      margin-bottom: 0;
      margin-left: -4px;
    }
    .settings-input {
      .el-input {
        width: calc(50% - 8px);
      }
    }
    .info-box {
      border: 1px solid $border_gray;
      background: $bg_gray_G1;
      padding: 16px 16px 12px;
    }
    .label-tag {
      max-width: 200px;
    }
    .settings-tip-box {
      background: rgba(65, 106, 255, 0.05);
      border: 1px solid #8daaff;
      border-radius: 2px;
      .markdown-body {
        font-size: 14px;
        color: $font;
      }
    }
  }
}
</style>
