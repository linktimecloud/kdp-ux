<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { get, orderBy, keys, isEmpty, cloneDeep } from 'lodash'
import i18n from '@/i18n'

import PagerBar from '@/components/pager/PagerBar.vue'
import ViewContextSettingsButton from './common/ViewContext.vue'

import { timeformat } from '@/utils/utils.js'

import { getBdcContextSettingsAPI, getBdcContextSecretsAPI } from '@/api/bdc'
import { PAGINATION } from '@/constant'

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

const defaultOrderBy = 'createTime'
const processing = ref({
  list: false,
  import: false
})
const data = ref([])
const filterList = ref([])
const pagination = ref(PAGINATION())
const dataSort = ref({
  order: false,
  orderBy: defaultOrderBy
})

const columns = computed(() => {
  return [
    {
      prop: 'name',
      label: i18n.t('common.name'),
      minWidth: 180,
      sortable: 'custom'
    },
    {
      prop: 'origin',
      label: i18n.t('common.origin'),
      minWidth: 100,
      sortable: 'custom'
    },
    {
      prop: 'type',
      label: i18n.t('common.settingsType'),
      minWidth: 150,
      sortable: 'custom'
    },
    {
      prop: 'keys',
      label: i18n.t('common.key'),
      minWidth: 150,
      sortable: false
    },
    {
      prop: 'createTime',
      label: i18n.t('common.createdAt'),
      minWidth: 150,
      sortable: 'custom'
    }
  ]
})

const tableList = computed(() => {
  const { limit, start } = pagination.value
  let ret = filterList.value || []
  ret = ret.slice(start, start + limit)
  return ret
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
  }
}

const getFilterList = () => {
  pagination.value = PAGINATION()
  const list = cloneDeep(data.value)
  filterList.value = orderBy(list, get(dataSort, 'value.orderBy'), [get(dataSort, 'value.order') ? 'asc' : 'desc'])
  pagination.value.total = filterList.value.length || 0
}

const getKeys = (item) => {
  const keysObj = get(item, 'properties') || {}
  return !isEmpty(keysObj) && ((keys(keysObj).join()) || [])
}

const getOrigin = (item) => {
  const origin = get(item, 'origin') || 'manual'
  return i18n.te(`cluster.contextSettingOrigin.${origin}`) ? i18n.t(`cluster.contextSettingOrigin.${origin}`) : ''
}

const handlerSortBy = ({ prop, order }) => {
  dataSort.value = {
    orderBy: prop || defaultOrderBy,
    order: order === 'ascending' ? true : false
  }
}

onMounted(() => {
  getList()
})

watch(() => props.refreshFlag, () => {
  getList()
})
watch(() => dataSort, () => {
  getFilterList()
}, { deep: true })
</script>

<template lang="pug">
.application-context-settings
  .application-context-settings-container.shadow-box
    .table-box(v-loading="processing.list")
      el-table.border-none(
        :data="tableList",
        border,
        :default-sort="{ prop: defaultOrderBy, order: 'descending' }"
        @sort-change="handlerSortBy"
      )
        template(
          v-for="({ prop, label, minWidth, width, sortable }, idx) in columns",
          :key="`${prop}${idx}`"
        )
          el-table-column(
            :prop="prop",
            :label="label",
            :min-width="minWidth",
            :width="width",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false",
            :sortable="sortable"
          )
            template(#default="scope")
              ViewContextSettingsButton(v-if="prop === 'name'", :data="{ ...scope.row }", :type="type")
                span {{ scope.row.name }}
              span(v-else-if="prop === 'origin'") {{ getOrigin(scope.row) ?? '-' }}
              span(v-else-if="prop === 'type'") {{ scope.row.type ?? '-' }}
              span(v-else-if="prop === 'keys'") {{ getKeys(scope.row) ?? '-' }}
              span(v-else-if="prop === 'createTime'") {{ timeformat(scope.row.createTime) }}
              span(v-else) {{ scope.row[prop] }}
      PagerBar(:data="pagination", @update:data="pagination = $event")
</template>
