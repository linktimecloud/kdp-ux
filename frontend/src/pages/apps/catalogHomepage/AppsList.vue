<script setup>
import { ref, computed, onMounted } from 'vue'
import { get } from 'lodash'
import i18n from '@/i18n'

import JsonTree from '@/components/json/FormatJson.vue'

import { getCatalogsAppFormsDataAPI } from '@/api/catalog'

const processing = ref(false)
const data = ref([])
const drawerVisible = ref(false)
const selectedData = ref({})

const props = defineProps({
  catalog: {
    type: String,
    default: ''
  },
  form: {
    type: String,
    default: ''
  }
})

const columns = computed(() => {
  return [
    {
      prop: 'name',
      label: `${i18n.t('applications.appMode')}${i18n.t('common.name')}`
    },
    {
      prop: 'type',
      label: i18n.t('applications.modeType')
    },
    {
      prop: 'operate',
      label: i18n.t('common.operate')
    }
  ]
})

const getList = () => {
  const { catalog, form } = props
  if (!catalog || !form) return

  processing.value = true
  getCatalogsAppFormsDataAPI({ catalog, form }).then(rsp => {
    const item = rsp.data || {}
    data.value = [{
      name: get(item, 'metadata.labels.app'),
      type: get(item, 'spec.type'),
      value: get(item, 'spec.properties') || {}
    }]
  }).finally(() => {
    processing.value = false
  })
}

const openDrawer = (item) => {
  selectedData.value = item
  drawerVisible.value = true
}

onMounted(() => {
  getList()
})
</script>

<template lang="pug">
.catalog-apps-list.rounded(v-loading="processing")
  el-table.rounded(:data="data", border)
    el-table-column(
      v-for="({ prop, label }) in columns",
      :key="prop",
      :prop="prop",
      :label="label"
    )
      template(#default="scope")
        span(v-if="prop === 'operate'")
          el-button(type="primary", link, @click="openDrawer(scope.row)") {{ $t('common.view') }}{{ $t('applications.settingTemplate') }}
        span(v-else) {{ scope.row[prop]}}
  el-drawer(
    v-model="drawerVisible",
    class="catalog-apps-list-drawer",
    :title="`${$t('applications.settingTemplate')}: ${selectedData?.name}`",
    size="40%"
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    JsonTree.config-data.bg-gray.border.rounded.p-2(:data="selectedData?.value")
</template>

<style lang="scss">
.catalog-apps-list-drawer {
  .config-data {
    height: calc(100vh - 100px);
    min-height: 100px;
    overflow-y: auto;
  }
}
</style>
