<script setup>
import { ref, computed } from 'vue'
import i18n from '@/i18n'
import { get, isEmpty } from 'lodash'

import SchemaForm from '@/components/schemaForm/SchemaForm.vue'
import EmptyHolder from '@/components/empty/EmptyHolder.vue'
import JsonTree from '@/components/json/FormatJson.vue'

import { copyToClipboard } from '@/utils/document'
import { getBdcContextSettingAPI, getBdcContextSettingDefinitionSchemaAPI, getBdcContextSecretAPI, getBdcContextSecretDefinitionSchemaAPI } from '@/api/bdc'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'applicationSetting'
  }
})

const processing = ref({
  schema: false,
  form: false
})
const form = ref({})
const schema = ref({})
const drawerVisible = ref(false)
const isCode = ref(false)

const bdc = computed(() => {
  return get(props.data, 'bdc.name') || ''
})

const actionTitle = computed(() => {
  return `${i18n.t('common.view')}${currentTypeResource.value.title}：${get(props.data, 'name')}`
})

const origin = computed(() => {
  const origin = get(props.data, 'origin')
  return i18n.te(`cluster.contextSettingOrigin.${origin}`) ? i18n.t(`cluster.contextSettingOrigin.${origin}`) : ''
})

const currentTypeResource = computed(() => {
  return {
    applicationSetting: {
      title: i18n.t('applications.applicationUsedSettings'),
      form: getBdcContextSettingAPI,
      schema: getBdcContextSettingDefinitionSchemaAPI
    },
    applicationSecret: {
      title: i18n.t('applications.applicationSecret'),
      schema: getBdcContextSecretAPI,
      form: getBdcContextSecretDefinitionSchemaAPI
    }
  }[props.type]
})

const getSchema = async () => {
  const defType = get(props.data, 'type')
  const bdcName = bdc.value

  schema.value = {}
  if (defType) {
    processing.value.schema = true
    const apiName = currentTypeResource.value.schema
    await apiName({ bdcName, defType }).then((rsp) => {
      schema.value = get(rsp, 'data') || {}
    })
    processing.value.schema = false
  }
}

const getForm = async() => {
  const name = get(props.data, 'metaName') || ''
  form.value = {}
  if (name) {
    processing.value.form = true
    const apiName = currentTypeResource.value.form
    await apiName({ name }).then((rsp) => {
      form.value = get(rsp, 'data') || {}
    })
    processing.value.form = false
  }
}

const openDrawer = () => {
  drawerVisible.value = true
  isCode.value = false
  getSchema()
  getForm()
}

const copyContent = () => {
  if (!isEmpty(form.value.properties)) {
    const content = JSON.stringify(form.value.properties)
    copyToClipboard(content)
    this.$message({
      type: 'success',
      message: i18n.t('common.copySuccess')
    })
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
    v-model="drawerVisible",
    direction="rtl",
    size="50%",
    :append-to-body="true",
    class="view-context-settings-drawer",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container
      .flex.mb-3
        .flex.mr-3
          .label.mr-1 {{ $t('menu.bigDataCluster') }}:
          .value {{ bdc ?? '-' }}
        template(v-if="type === 'applicationSetting'")
          .flex.mr-3
            .label.mr-1 {{ $t('common.origin') }}:
            .value {{ origin ?? '-' }}
          .flex.mr-3
            .label.mr-1 {{ $t('common.settingsType') }}:
            .value {{ form.type ?? '-' }}
      div.flex.justify-between.items-center.mb-2
        span {{ `${$t('common.key')}${$t('common.value')}` }}
        .flex.items-center(v-if="!isEmpty(schema)")
          el-button(v-if="isCode", type="default", size="small", @click="copyContent")
            i.remix.ri-file-copy-2-line
            span {{ $t('common.copy') }}
          el-button(type="default", size="small", @click="isCode = !isCode")
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
    template(#footer)
      .flex.justify-end
        el-button.mr-2(@click="drawerVisible = false") {{ $t('common.cancel') }}
</template>
