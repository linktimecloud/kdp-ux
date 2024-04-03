<script>
import { cloneDeep, get, some, isEmpty } from 'lodash'
import Ajax from '@/api/ajax'
import { mapGetters } from 'vuex'

import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'
import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'

import ReasonButton from '@/common/reasonButton'
import SchemaForm from '@/components/schemaForm'
import EmptyHolder from '@/components/empty'

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
    ...mapGetters([
      'currentUser',
      'lang'
    ]),
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

      const resource = {
        name: 'POST_BDC_APPLICATION',
        sets: { bdcName }
      }
      bdcName && new Ajax({
        resource,
        data: {
          ...reqData
        },
        success (rsp = {}) {
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
            },
            direct: false
          })
        },
        loading: true
      }).fetch()
    },
    getSchema () {
      const self = this
      const defType = get(this.appConfig, 'spec.type')
      const { form: { bdc: bdcName } } = self
      defType && bdcName && new Ajax({
        resource: {
          name: 'GET_BDC_APPLICATION_DEFINITION_SCHEMA',
          sets: { bdcName, defType }
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
    },
    getAppConfig () {
      const self = this
      const { data: { catalog, form } } = self

      new Ajax({
        resource: {
          name: 'GET_CATALOGS_APP_FORMS_DATA',
          sets: { catalog, form }
        },
        success (rsp = {}) {
          self.appConfig = cloneDeep(rsp.data) || {}
          self.schemaForm = cloneDeep(get(rsp.data, 'spec.properties')) || {}
          self.originSchemaForm = cloneDeep(get(rsp.data, 'spec.properties')) || {}
          self.getSchema()
        },
        before () {
          self.schemaForm = {}
          self.appConfig = {}
          self.originSchemaForm = {}
          self.processing.config = true
        },
        complete () {
          self.processing.config = false
        }
      }).fetch()
    },
    getInstalledBdcList () {
      const self = this
      const { data: { catalog, form } } = self

      return new Ajax({
        resource: {
          name: 'GET_CATALOGS_APP_FORMS_INSTALL',
          sets: { catalog, form }
        },
        success (rsp = {}) {
          self.installedBdcList = get(rsp, 'data.installtion' || [])
        },
        before () {
          self.schemaForm = {}
          self.appConfig = {}
          self.originSchemaForm = {}
          self.processing.config = true
        },
        complete () {
          self.processing.config = false
        }
      }).fetch()
    },
    getBdcList () {
      const self = this
      const { installedBdcList } = this
      return new Ajax({
        resource: 'GET_BDCS',
        success (rsp) {
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
        },
        before () {
          self.processing.bdc = true
        },
        complete () {
          self.processing.bdc = false
        }
      }).fetch()
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
    :type="btnType",
    @click="handleOpen"
  ) {{ $t('common.install') }}
  el-drawer(
    custom-class="market-install-drawer",
    :title="$t('common.install')",
    :visible="drawerVisible",
    direction="rtl",
    size="50%",
    :wrapperClosable="false",
    :append-to-body="true",
    :before-close="handleClose"
  )
    .drawer-container
      .drawer-body(v-loading="processing.installation")
        .d-flex.flex-wrap.mb-3.align-items-center
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
            :valid.sync="valid",
            :needFirstCheck="true"
          )
          EmptyHolder(
            v-else,
            :height="300"
          )
      .el-drawer__footer.d-flex.justify-content-end
        el-button(@click="drawerVisible = false") {{ $t('common.cancel') }}
        ReasonButton.ml-2(
          type="primary",
          :reason="saveReason",
          @click="installApp"
        ) {{ $t('common.confirm') + $t('common.install') }}
</template>

<style lang="scss">
@import '~@/root.scss';

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
