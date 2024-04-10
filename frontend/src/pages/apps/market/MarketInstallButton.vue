<script>
import { cloneDeep, get, some, isEmpty } from 'lodash'

import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'
import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'
import { getBdcListAPI, postBdcApplicationAPI, getBdcApplicationDefinitionSchemaAPI } from '@/api/bdc'
import { getCatalogsAppFormsDataAPI, getCatalogsAppFormsInstallAPI } from '@/api/catalog'

import ReasonButton from '@/common/ReasonButton.vue'
import SchemaForm from '@/components/schemaForm/SchemaForm.vue'
import EmptyHolder from '@/components/empty/EmptyHolder.vue'

const DEFAULT_FORM = () => ({
  bdc: ''
})

export default {
  name: 'market-install-button',
  props: {
    data: {
      type: Object,
      required: true
    },
    btnType: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      drawerVisible: false,
      form: DEFAULT_FORM(),
      appConfig: {},
      processing: {
        config: false,
        bdc: false,
        save: false,
        schema: false,
        installation: false
      },
      bdcList: [],
      installedBdcList: [],
      valid: false,
      schema: {},
      schemaForm: {},
      originSchemaForm: {}
    }
  },
  computed: {
    appName () {
      return this.data?.form
    },
    reqData () {
      const { schemaForm, appName: appFormName, form: { bdc } } = this
      const appTemplateType = get(this.appConfig, 'spec.type')

      let ret = {}
      ret = {
        appFormName,
        appTemplateType,
        properties: {
          ...schemaForm
        },
        appendWebhook: true,
        processInfo: {
          handle: 'install',
          category: 'application',
          // 此处的appName仅为单纯的应用名称，但安装成功后，应用实例的名称会拼接上bdc的前缀，所以这里传递给操作记录的接口也保持一致进行拼接，方便搜索。
          name: `${bdc}-${appFormName}`
        }
      }
      return ret
    },
    infoMap () {
      const { appName } = this
      return [
        {
          label: this.$t('applications.app'),
          value: appName,
          show: true
        }
      ].filter(item => item.show)
    },
    saveReason () {
      const { form: { bdc }, valid } = this
      const isInstalled = get(this.bdcList.find(item => item.bdc === bdc), 'isInstalled')
      if (isInstalled) return this.$t('applications.appInstallTips')

      let ret = ''
      // 资源相关
      if (!valid) ret = this.$t('quota.invalidFormTips')

      // 数据相关
      if (!bdc) ret = this.$t('validation.requiredFieldNoEmpty', { name: this.$t('cluster.bdc') })

      // 进程相关
      if (some(this.processing, Boolean)) ret = this.$t('common.processing')
      return ret
    }
  },
  methods: {
    get,
    isEmpty,
    async handleOpen () {
      this.getAppConfig()
      await this.getInstalledBdcList()
      await this.getBdcList()
      this.drawerVisible = true
    },
    installApp () {
      const self = this
      const { reqData, form: { bdc: bdcName } } = self


      postBdcApplicationAPI({
        bdcName,
        data: {
          ...reqData
        }
      }).then(rsp => {
        const pid = get(rsp, 'data.pid')
        pid && processRedirect({
          id: pid,
          refresh () {
            toast.log(
              self.$t('common.actionSuccess'),
              { type: 'success' }
            )
            self.drawerVisible = false
            self.$emit('refresh')
          }
        })
      })
    },
    getSchema () {
      const self = this
      const defType = get(this.appConfig, 'spec.type')
      const { form: { bdc: bdcName } } = self

      if (!bdcName || !defType) return

      self.processing.schema = true
      getBdcApplicationDefinitionSchemaAPI({
        bdcName,
        defType
      }).then(rsp => {
        self.schema = cloneDeep(get(rsp, 'data')) || {}
      }).finally(() => {
        self.processing.schema = false
      })
    },
    getAppConfig () {
      const self = this
      const { data: { catalog, form } } = self

      self.schemaForm = {}
      self.appConfig = {}
      self.originSchemaForm = {}
      self.processing.config = true

      getCatalogsAppFormsDataAPI({
        catalog,
        form
      }).then(rsp => {
        self.appConfig = cloneDeep(rsp.data) || {}
        self.schemaForm = cloneDeep(get(rsp.data, 'spec.properties')) || {}
        self.originSchemaForm = cloneDeep(get(rsp.data, 'spec.properties')) || {}
        self.getSchema()
      }).finally(() => {
        self.processing.config = false
      })
    },
    getInstalledBdcList () {
      const self = this
      const { data: { catalog, form } } = self

      self.schemaForm = {}
      self.appConfig = {}
      self.originSchemaForm = {}
      self.processing.config = true

      return getCatalogsAppFormsInstallAPI({
        catalog,
        form
      }).then(rsp => {
        self.installedBdcList = get(rsp, 'data.installtion' || [])
      }).finally(() => {
        self.processing.config = false
      })
    },
    getBdcList () {
      const self = this
      const { installedBdcList } = this

      self.processing.bdc = true
      return getBdcListAPI().then(rsp => {
        const list = get(rsp, 'data', [])
        self.bdcList = list.map(item => {
          const installList = get(installedBdcList.find(i => i.org === item.orgName), 'bdc', [])
          return {
            org: item.orgName,
            bdc: item.name,
            isNotRunning: !item.status === 'Active',
            isInstalled: installList.includes(item.name)
          }
        })
        const bdc = get(list, '[0].name')
        if (bdc) {
          self.form.bdc = bdc
        }
      }).finally(() => {
        self.processing.bdc = false
      })
    },
    getBdcStatus (item) {
      const { status } = item
      const currentStatus = status || 'InActive'
      return get((BIG_DATA_CLUSTER_STATUS()).find(item => item.value === currentStatus), 'label') || this.t('cluster.bdcStatus.inActive')
    },
    resetSchema () {
      this.schema = {}
      this.schemaForm = cloneDeep(this.originSchemaForm)
    },
    handleClose () {
      this.drawerVisible = false
      this.form = DEFAULT_FORM()
      this.bdcList = []
      this.schema = {}
      this.schemaForm = {}
    }
  },
  watch: {
    'form.bdc' (val) {
      this.resetSchema()
      if (val) {
        this.getSchema()
      }
    }
  },
  components: {
    ReasonButton,
    SchemaForm,
    EmptyHolder
  }
}
</script>

<template lang="pug">
.market-install-button
  el-button(
    :type="btnType === 'text' ? 'primary' : btnType",
    :link="btnType === 'text'",
    @click="handleOpen"
  ) {{ $t('common.install') }}
  el-drawer(
    class="market-install-drawer",
    :title="$t('common.install')",
    v-model="drawerVisible",
    direction="rtl",
    size="50%",
    :append-to-body="true",
    :before-close="handleClose"
  )
    .drawer-container(v-if="drawerVisible")
      .drawer-body(v-loading="processing.installation")
        .flex.flex-wrap.mb-3.items-center
          .d-block.mr-3(v-for="({ label, value }) in infoMap", :key="value")
            span.text-gray {{ label }}：
            span {{ value }}
          .d-block
            span.text-gray {{ $t('menu.bigDataCluster') }}：
            el-select(
              v-loading="processing.bdc",
              v-model="form.bdc",
              filterable
            )
              el-option(
                v-for="item in bdcList",
                :key="item.bdc",
                :value="item.bdc",
                :label="item.bdc"
              ) {{item.bdc}}{{ item.isNotRunning ? ` (${getBdcStatus(item)})` : item.isInstalled ? ` (${$t('applications.installed')})` : '' }}
        .config-box.border.rounded.p-3(v-loading="processing.schema || processing.config")
          SchemaForm(
            v-if="!isEmpty(schema.JSONSchema)",
            v-model="schemaForm",
            :schema="schema.JSONSchema",
            :uiSchema="schema.UISchema"
            :optionProps="{ labelPosition: 'right', labelWidth: '160px' }",
            :needFirstCheck="true",
            @update:valid="valid = $event",
          )
          EmptyHolder(
            v-else,
            :height="300"
          )
    template(#footer)
      .flex.justify-end
        el-button.mr-2(@click="drawerVisible = false") {{ $t('common.cancel') }}
        ReasonButton(
          type="primary",
          :reason="saveReason",
          @click="installApp"
        ) {{ $t('common.confirm') + $t('common.install') }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.market-install-drawer {
  .drawer-container {
    .el-form-item__label {
      padding: 0;
      margin-bottom: 0;
      margin-left: -4px;
    }
  }
}
</style>
