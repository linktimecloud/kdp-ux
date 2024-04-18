<script setup>
import { ref, computed } from 'vue'
import i18n from '@/i18n'
import { isEmpty, get, some } from 'lodash'
import toast from '@/utils/toast'

import { processRedirect } from '@/utils/process'
import { getAppAPI, putAppAPI } from '@/api/applications'
import { getBdcApplicationDefinitionSchemaAPI } from '@/api/bdc'

import ReasonButton from '@/common/ReasonButton.vue'
import AppConfigInfo from '@/common/apps/AppConfigInfo.vue'
import SchemaForm from '@/components/schemaForm/SchemaForm.vue'
import EmptyHolder from '@/components/empty/EmptyHolder.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  btnOptions: {
    type: Object,
    default: () => ({ link: true })
  }
})

const drawerVisible = ref(false)
const configData = ref({})
const processing = ref({
  fetch: false,
  update: false,
  schema: false
})
const schema = ref({})
const schemaForm = ref({})
const valid = ref(false)

const appName = computed(() => {
  return get(props.data, 'name')
})

const reqData = computed(() => {
  return {
    properties: {
      ...schemaForm.value
    },
    appendWebhook: true,
    processInfo: {
      handle: 'update',
      category: 'application',
      name: appName.value
    }
  }
})

const updateReason = computed(() => {
  return appName.value ? '' : i18n.t('applications.disableUpdateRenderTips')
})

const basicData = computed(() => {
  const { data } = props
  const config = configData.value
  return {
    catalog: get(data, 'catalog'),
    appForm: get(config, 'appFormName'),
    appName: get(config, 'appRuntimeName'),
    labels: get(config, 'labels'),
    bdc: get(config, 'bdc.name'),
    bdcStatus: get(config, 'bdc.status'),
    annotations: get(config, 'annotations')
  }
})

const saveReason = computed(() => {
  let ret = ''
  if (!valid.value) ret = i18n.t('quota.invalidFormTips')
  if (some(processing.value, Boolean)) ret = i18n.t('common.processing')
  return ret
})

const handleOpen = async () => {
  schemaForm.value = {}
  await getAppConfig()
  drawerVisible.value = true
}

const getAppConfig = async () => {
  configData.value = {}
  schemaForm.value = {}
  processing.value.fetch = true
  await getAppAPI({ appName: appName.value }).then((rsp) => {
    configData.value = get(rsp, 'data') || {}
    schemaForm.value = get(rsp, 'data.properties') || {}
    getSchema()
  }).finally(() => {
    processing.value.fetch = false
  })
}

const getSchema = async () => {
  const defType = get(configData, 'value.appTemplateType')
  const bdcName = get(props, 'data.bdc')
  if (!bdcName || !defType) return
  processing.value.schema = true
  getBdcApplicationDefinitionSchemaAPI({ defType, bdcName }).then((rsp) => {
    schema.value = get(rsp, 'data') || {}
  }).finally(() => {
    processing.value.schema = false
  })
}

const emit = defineEmits(['refresh'])

const updateAppConfig = async () => {
  processing.value.update = true
  putAppAPI({ appName: appName.value, data: reqData.value }).then((rsp) => {
    const id = get(rsp, 'data.pid')
    id && processRedirect({
      id,
      refresh () {
        toast.log(
          i18n.t('common.actionSuccess'),
          { type: 'success' }
        )
        getAppConfig()
        emit('refresh')
      }
    })
    drawerVisible.value = false
  }).finally(() => {
    processing.value.update = false
  })
}
</script>

<template lang="pug">
.update-config-button.flex(v-if="data.status !== 'stopping'")
  ReasonButton(
    :btn-options="btnOptions",
    :reason="updateReason",
    @click="handleOpen"
  ) {{ $t('common.update') }}
  el-drawer(
    v-model="drawerVisible",
    class="update-config-drawer",
    :title="`${$t('common.update')}: ${appName}`",
    direction="rtl",
    size="50%",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container(v-if="drawerVisible", v-loading="processing.fetch")
      AppConfigInfo(:data="basicData", type="updateApp")
      .config-box.border.rounded.p-3(v-loading="processing.schema || processing.fetch")
        SchemaForm(
          v-if="!isEmpty(schema.JSONSchema) && !isEmpty(schemaForm)",
          v-model="schemaForm",
          :schema="schema.JSONSchema",
          :ui-schema="schema.UISchema"
          :option-props="{ labelPosition: 'right', labelWidth: '160px' }",
          @update:valid="valid = $event"
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
          :reason="saveReason"
          @click="updateAppConfig"
        ) {{ $t('common.confirm') }}
</template>
