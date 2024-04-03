<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { get, orderBy, keys, isEmpty, cloneDeep } from 'lodash'
import i18n from '@/i18n'

import PagerBar from '@/components/pager/PagerBar.vue'
// import ViewContextSettingsButton from '../common/viewContextSettings.vue'
import ReasonButton from '@/common/ReasonButton.vue'

import { timeformat } from '@/utils/utils.js'

import { getBdcContextSettingsAPI, getBdcContextSecretsAPI } from '@/api/bdc'
import { PAGINATION } from '@/constant'
import { useLanguagesStore } from '@/stores/modules/languages'

const props = defineProps({
  refreshFlag: Number,
  propsFilter: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'applicationSetting' // applicationSetting/applicationSecret
  }
})

const processing = ref({
  list: false,
  import: false
})
const data = ref([])
const filterList = ref([])
const showColumns = ref([])
const pagination = ref(PAGINATION())
const dataOrderBy = ref('createTime')
const dataOrder = ref(false)

const bdc = computed(() => {
  return get(props.propsFilter, 'bdc') || ''
})

const columns = computed(() => {
  return [
    {
      prop: 'name',
      label: i18n.t('common.name'),
      minWidth: 180
    },
    {
      prop: 'origin',
      label: i18n.t('common.origin'),
      minWidth: 100
    },
    {
      prop: 'type',
      label: i18n.t('common.settingsType'),
      minWidth: 150
    },
    {
      prop: 'keys',
      label: i18n.t('common.key'),
      minWidth: 150
    },
    {
      prop: 'createTime',
      label: i18n.t('common.createdAt'),
      minWidth: 150
    }
  ]
})

const tableList = computed(() => {
  const { limit, start } = pagination.value
  let ret = filterList.value || []
  ret = ret.slice(start, start + limit)
  return ret
})

const total = computed(() => {
  return filterList.value.length || 0
})

const currentTypeResource = computed(() => {
  return {
    applicationSetting: {
      title: i18n.t('applications.applicationUsedSettings'),
      list: getBdcContextSettingsAPI,
      typeLabel: i18n.t('common.settingsType'),
      category: 'bigDataClusterApplicationContextSetting'
    },
    applicationSecret: {
      title: i18n.t('applications.applicationSecret'),
      list: getBdcContextSecretsAPI,
      typeLabel: `${i18n.t('cluster.secret')}${i18n.t('common.type')}`,
      category: 'bigDataClusterApplicationSecret'
    }
  }[props.type]
})

const getList = async () => {
  const { propsFilter: { bdc: bdcName } } = props

  data.value = []
  if (bdcName) {
    const apiName = currentTypeResource.value.list
    processing.value.list = true
    await apiName({
      bdcName
    }).then((rsp) => {
      data.value = get(rsp, 'data') || []
      getFilterList()
    })
    processing.value.list = false
    refreshTable()
  }
}

const getFilterList = () => {
  pagination.value = PAGINATION()
  filterList.value = cloneDeep(data.value)
  const o = dataOrder.value ? 'asc' : 'desc'
  filterList.value = orderBy(filterList.value, [dataOrderBy.value], [o])
  pagination.value.total = filterList.value.length || 0
}

const bigDataClusterListRef = ref(null)

const refreshTable = () => {
  nextTick(() => {
    const el = bigDataClusterListRef.value
    el && el.doLayout()
  })
}

const getKeys = (item) => {
  const keysObj = get(item, 'properties') || {}
  return !isEmpty(keysObj) && ((keys(keysObj).join()) || [])
}

const getOrigin = (item) => {
  const origin = get(item, 'origin') || 'manual'
  return i18n.te(`cluster.contextSettingOrigin.${origin}`) ? i18n.t(`cluster.contextSettingOrigin.${origin}`) : ''
}

onMounted(() => {
  getList()
})

watch(() => props.refreshFlag, () => {
  getList()
})

const languagesStore = useLanguagesStore()
const lang = computed(() => languagesStore.currentLang)

watch(() => lang, () => {
  const data = cloneDeep(showColumns.value.length ? showColumns.value : columns.value)
  showColumns.value = data.map(item => {
    return {
      ...item,
      label: get(columns.value.find(c => c.prop === item.prop), 'label')
    }
  })
}, { immediate: true })
</script>

<template lang="pug">
.application-context-settings
  .application-context-settings-container.shadow-box
    .table-box(v-loading="processing.list")
      el-table.border-none(
        :data="tableList",
        border,
        ref="bigDataClusterListRef"
      )
        template(
          v-for="({ prop, label, minWidth, show, width }, idx) in showColumns",
          :key="`${prop}${idx}`"
        )
          el-table-column(
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :width="width",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false"
          )
            template(#default="scope")
              //- ViewContextSettingsButton(v-if="prop === 'name'", :data="{ ...scope.row }", :type="type")
              //-   span {{ scope.row.name }}
              span(v-if="prop === 'origin'") {{ getOrigin(scope.row) ?? '-' }}
              span(v-else-if="prop === 'type'") {{ scope.row.type ?? '-' }}
              span(v-else-if="prop === 'keys'") {{ getKeys(scope.row) ?? '-' }}
              span(v-else-if="prop === 'createTime'") {{ timeformat(scope.row.createTime) }}
              span(v-else) {{ scope.row[prop] }}
      PagerBar(:data="pagination")
</template>
