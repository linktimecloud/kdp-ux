<script setup>
import { ref, computed, watch } from 'vue'
import { cloneDeep, get, some, isEmpty, set } from 'lodash'
import i18n from '@/i18n'

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

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  btnType: {
    type: String,
    default: 'text'
  }
})

const drawerVisible = ref(false)
const form = ref(DEFAULT_FORM())
const appConfig = ref({})
const processing = ref({
  config: false,
  bdc: false,
  save: false,
  schema: false,
  installation: false
})
const bdcList = ref([])
const installedBdcList = ref([])
const valid = ref(false)
const schema = ref({})
const schemaForm = ref({})
const originSchemaForm = ref({})

const appName = computed(() => {
  return props.data?.form
})
const reqData = computed(() => {
  const bdc = get(form, 'value.bdc')
  const appTemplateType = get(appConfig, 'value.spec.type')

  let ret = {}
  ret = {
    appFormName: appName.value,
    appTemplateType,
    properties: {
      ...schemaForm.value
    },
    appendWebhook: true,
    processInfo: {
      handle: 'install',
      category: 'application',
      // 此处的appName仅为单纯的应用名称，但安装成功后，应用实例的名称会拼接上bdc的前缀，所以这里传递给操作记录的接口也保持一致进行拼接，方便搜索。
      name: `${bdc}-${appName.value}`
    }
  }
  return ret
})
const infoMap = computed(() => {
  return [
    {
      label: i18n.t('applications.app'),
      value: appName.value
    }
  ]
})
const saveReason = computed(() => {
  const bdc = get(form, 'value.bdc')
  const isInstalled = get(bdcList.value.find(item => item.bdc === bdc), 'isInstalled')
  if (isInstalled) return i18n.t('applications.appInstallTips')

  let ret = ''
  if (!valid.value) ret = i18n.t('quota.invalidFormTips')
  if (!bdc) ret = i18n.t('validation.requiredFieldNoEmpty', { name: i18n.t('cluster.bdc') })
  if (some(processing.value, Boolean)) ret = i18n.t('common.processing')
  return ret
})
  
const handleOpen = async () => {
  drawerVisible.value = true
  await getInstalledBdcList()
  await getBdcList()
  await getAppConfig()
}
const emit = defineEmits(['refresh'])

const installApp = () => {
  const bdcName = get(form, 'value.bdc')
  postBdcApplicationAPI({
    bdcName,
    data: {
      ...reqData.value
    }
  }).then(rsp => {
    const pid = get(rsp, 'data.pid')
    pid && processRedirect({
      id: pid,
      refresh () {
        toast.log(
          i18n.t('common.actionSuccess'),
          { type: 'success' }
        )
        drawerVisible.value = false
        emit('refresh')
      }
    })
  })
}
const getSchema = async () => {
  const defType = get(appConfig, 'value.spec.type')
  const bdcName = get(form, 'value.bdc')
  if (!bdcName || !defType) return

  processing.value.schema = true
  await getBdcApplicationDefinitionSchemaAPI({
    bdcName,
    defType
  }).then(rsp => {
    schema.value = cloneDeep(get(rsp, 'data')) || {}
    set(schema.value, 'JSONSchema.properties.kerberos.properties.enabled.default', 'false')
  }).finally(() => {
    processing.value.schema = false
  })
}
const getAppConfig = async () => {
  const { data: { catalog, form } } = props
  schemaForm.value = {}
  appConfig.value = {}
  originSchemaForm.value = {}
  processing.value.config = true
  return await getCatalogsAppFormsDataAPI({
    catalog,
    form
  }).then(rsp => {
    appConfig.value = cloneDeep(rsp.data) || {}
    schemaForm.value = cloneDeep(get(rsp.data, 'spec.properties')) || {}
    originSchemaForm.value = cloneDeep(get(rsp.data, 'spec.properties')) || {}
    getSchema()
  }).finally(() => {
    processing.value.config = false
  })
}
const getInstalledBdcList = async () => {
  const { data: { catalog, form } } = props
  processing.value.installation = true
  return await getCatalogsAppFormsInstallAPI({
    catalog,
    form
  }).then(rsp => {
    installedBdcList.value = get(rsp, 'data.installtion' || [])
  }).finally(() => {
    processing.value.installation = false
  })
}
const getBdcList = () => {
  processing.value.bdc = true
  return getBdcListAPI().then(rsp => {
    const list = get(rsp, 'data', [])
    bdcList.value = list.map(item => {
      const installList = get(installedBdcList.value.find(i => i.org === item.orgName), 'bdc', [])
      return {
        org: item.orgName,
        bdc: item.name,
        isNotRunning: !item.status === 'Active',
        isInstalled: installList.includes(item.name)
      }
    })
    const bdc = get(list, '[0].name')
    if (bdc) {
      form.value.bdc = bdc
    }
  }).finally(() => {
    processing.value.bdc = false
  })
}
const getBdcStatus = (item) => {
  const { status } = item
  const currentStatus = status || 'InActive'
  return get((BIG_DATA_CLUSTER_STATUS()).find(item => item.value === currentStatus), 'label') || i18n.t('cluster.bdcStatus.inActive')
}
const resetSchema = () => {
  schema.value = {}
  schemaForm.value = cloneDeep(originSchemaForm.value)
}
const handleClose = () => {
  drawerVisible.value = false
  form.value = DEFAULT_FORM()
  bdcList.value = []
  schema.value = {}
  schemaForm.value = {}
}

watch(() => 'form.bdc', (val) => {
  resetSchema()
  if (val) {
    getSchema()
  }
})
</script>

<template lang="pug">
.market-install-button
  el-button(
    :type="btnType === 'text' ? 'primary' : btnType",
    :link="btnType === 'text'",
    @click="handleOpen"
  ) {{ $t('common.install') }}
  el-drawer(
    v-model="drawerVisible",
    class="market-install-drawer",
    :title="$t('common.install')",
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
              v-model="form.bdc",
              v-loading="processing.bdc",
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
            :ui-schema="schema.UISchema"
            :option-props="{ labelPosition: 'right', labelWidth: '160px' }",
            :need-first-check="true",
            @update:valid="valid = $event",
          )
          EmptyHolder(
            v-else,
            :full="false",
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
