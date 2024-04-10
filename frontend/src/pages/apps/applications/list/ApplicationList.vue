<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import i18n from '@/i18n'
import { get, orderBy, isEmpty, cloneDeep, has } from 'lodash'

import PageHeader from '@/components/header/PageHeader.vue'
import SearchBox from '@/common/SearchBox.vue'
import PagerBar from '@/components/pager/PagerBar.vue'
import UninstallButton from '@/common/apps/Operate/UninstallButton.vue'
import UpdateConfigButton from '@/common/apps/Operate/UpdateConfigButton.vue'

import StatusInfo from '@/common/apps/Operate/StatusInfo.vue'
import AppStatus from '@/common/apps/AppStatus.vue'

import { DEFAULT_FILTER, APPLICATION_LIST_COLUMNS, APPLICATION_PROPERTIES } from './constant'
import { PAGINATION } from '@/constant'
import { timeformat, filterTableList } from '@/utils/utils.js'
import { getCatalogsAppFormsAppsAPI } from '@/api/catalog'
import { useGlobalStore } from '@/stores/modules/global'
import { useCatalogManageStore } from '@/stores/modules/catalogManage'

const globalStore = useGlobalStore()
const catalogManageStore = useCatalogManageStore()

const props = defineProps({
  breadcrumb: {
    type: Object,
    default: () => ({})
  },
  propsFilter: {
    type: Object,
    default: () => ({})
  },
  options: { // hiddenSearch/hiddenColumns/hiddenSearch/defaultOrderBy/hiddenExportCsv
    type: Object,
    default: () => ({})
  },
  refreshFlag: Number
})

const processing = ref(false)
const filter = ref(DEFAULT_FILTER())
const data = ref([])
const pagination = ref(PAGINATION())
const filterList = ref([])
const dataSort = ref({
  order: false,
  orderBy: 'updateTime'
})

const userOrgName = computed(() => {
  return globalStore.userOrgName
})

const catalogTypeList = computed(() => {
  return catalogManageStore.catalogTypeList
})

const catalogTypesData = computed(() => {
  return catalogManageStore.catalogTypesData
})

const columns = computed(() => {
  const hiddenItem = get(props, 'options.hiddenColumns', [])
  return APPLICATION_LIST_COLUMNS().filter(item => item.show && !hiddenItem.includes(item.prop))
})

const properties = computed(() => {
  const hiddenItem = get(props, 'options.hiddenSearch', [])
  return APPLICATION_PROPERTIES({ catalogTypeList: catalogTypeList.value }).filter(item => !hiddenItem.includes(item.name))
})

const tableList = computed(() => {
  const { limit, start } = pagination.value
  let ret = filterList.value
  ret = ret.slice(start, start + limit)
  return ret
})

const defaultOrderBy = computed(() => {
  return props.options.defaultOrderBy || 'updateTime'
})

const getList = () => {
  processing.value = true
  getCatalogsAppFormsAppsAPI({
    ...props.propsFilter
  }).then((rsp) => {
    const list = get(rsp, 'data') || []
    data.value = list.map(item => {
      return {
        ...item,
        catalogType: get(catalogTypesData.value.find(c => c.name.toLowerCase() === item.catalog), 'category'),
        statusInfo: get(item, 'status') || {},
        status: get(item, 'status.status'),
        bdc: get(item, 'bdc.name'),
        bdcStatus: get(item, 'bdc.status'),
        updateTime: get(item, 'updateTime') || get(item, 'createTime')
      }
    })
    getFilterList()
  }).catch(() => {
    data.value = []
  }).finally(() => {
    processing.value = false
  })
}

const getFilterList = () => {
  pagination.value = PAGINATION()

  const list = filterTableList({
    list: data.value,
    filter: filter.value,
    order: get(dataSort, 'value.order') ? 'asc' : 'desc',
    orderBy: get(dataSort, 'value.orderBy'),
    compareFuncs: {
      name: (itemValue, filterValue) => itemValue.includes(filterValue),
      catalog: (itemValue, filterValue) => itemValue.includes(filterValue),
      catalogType: (itemValue, filterValue) => (!itemValue && filterValue === 'other') || itemValue === filterValue
    }
  })

  filterList.value = list
  pagination.value.total = list.length || 0
}

const reset = () => {
  filter.value = DEFAULT_FILTER()
  dataSort.value = {
    orderBy: defaultOrderBy.value,
    order: false
  }
}

const refresh = () => {
  getList()
}

const toAppDetail = (row) => {
  const { name, group, bdc, catalog } = row
  const query = {
    application: name,
    group,
    bdc
  }
  return {
    path: `/catalogHomepage/${catalog}`,
    query
  }
}

const handlerSortBy = ({ prop, order }) => {
  dataSort.value = {
    orderBy: prop || defaultOrderBy.value,
    order: order === 'ascending' ? true : false
  }
}

onMounted(() => {
  if (isEmpty(catalogTypesData.value)) {
    catalogManageStore.setCatalogTypes()
  }
  if (defaultOrderBy) {
    dataSort.value.orderBy = defaultOrderBy
  }
  refresh()
})

watch(() => props.refreshFlag, () => {
  refresh()
})

watch(() => filter, () => {
  getFilterList()
}, { deep: true })

watch(() => dataSort, () => {
  getFilterList()
}, { deep: true })
</script>

<template lang="pug">
.application-list
  PageHeader(v-if="!isEmpty(breadcrumb)", :data="breadcrumb")
    el-button(
      type="default"
      @click="refresh"
    )
      i.remix.ri-refresh-line
      span {{ $t('common.refresh') }}
  .application-list-container.shadow-box
    template(v-if="!has(options, 'hiddenSearch')")
      SearchBox.border-0(
        :data="filter",
        :properties="properties",
        :actionBtns="[{ value: 'reset', label: $t('common.reset'), type: 'default' }]",
        theme="light",
        @reset="reset"
      )
    .table-box(v-loading="processing")
      el-table(
        :data="tableList",
        border,
        :class="{ 'border-none': !props.options.hiddenSearch }",
        :default-sort="{ prop: defaultOrderBy, order: 'descending' }"
        @sort-change="handlerSortBy"
      )
        template(
          v-for="({ prop, label, minWidth, show, width }, idx) in columns",
          :key="prop + idx"
        )
          el-table-column(
            v-if="show",
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :width="width",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false",
            :sortable="prop === 'operate' ? false : 'custom'"
          )
            template(#default="scope")
              span(v-if="prop === 'name'")
                router-link.d-block(:to="toAppDetail(scope.row)", target="_blank")
                  span {{ scope.row.name }}
              span(v-else-if="prop === 'bdc'")
                template(v-if="scope.row.bdc")
                  span {{ scope.row.bdc ?? '-' }}
                  AppStatus(:status="scope.row.bdcStatus", sign="appBdcNotReadyTip", type="bigDataCluster")
                span(v-else) -
              span(v-else-if="prop === 'status'")
                AppStatus(:status="scope.row.status", type="instance")
                StatusInfo(
                  :data="{ ...scope.row, appName: scope.row.name }",
                  :info="scope.row.statusInfo",
                  type="instance",
                  :title="`${$t('applications.instance')}：${scope.row.name}`"
                )
              span(v-else-if="prop === 'updateTime'") {{ timeformat(scope.row.updateTime) }}
              span(v-else-if="prop === 'catalog'")
                router-link.d-block.text-info(v-if="scope.row.catalog", :to="`/catalogHomepage/${scope.row.catalog}`", target="_blank")
                  span {{ scope.row.catalog }}
                  i.remix.ri-external-link-line.ml-1
                .d-block(v-else) -
                .d-block
                  span.text-gray {{ scope.row.catalogType ?? '-' }}
              span(v-else-if="prop === 'operate'")
                .flex.items-center
                  UpdateConfigButton.after-line(
                    :data="scope.row",
                    @refresh="refresh"
                  )
                  el-dropdown
                    el-button(type="primary", link)
                      .flex.items-center
                        span {{ $t('common.more') }}
                        i.ri-arrow-down-s-line
                    template(#dropdown)
                      el-dropdown-menu.dropdown-menu-full-button
                        el-dropdown-item
                          router-link(:to="{ name: 'process', query: { name: scope.row.name } }", target="_blank")
                            .flex.more-btn
                              i.remix.ri-external-link-line
                              span {{ $t('menu.process') }}
                      el-dropdown-item(v-if="scope.row.status !== 'stopping'")
                        UninstallButton(
                          :data="{ appName: scope.row.name, bdc: scope.row.bdc }",
                          @refresh="refresh"
                        )
                          .flex.more-btn
                            i.remix.ri-uninstall-line.mr-1
                            span {{ $t('common.uninstall') }}
              span(v-else) {{ scope.row[prop] ?? '-' }}
      PagerBar(:data="pagination")
</template>

<style lang="scss">
@import '@/assets/root.scss';

.application-list {
  .pod-font {
    color: $font_high;
  }
  .application-list-container {
    .table-box {
      background: #fff;
    }
  }
  .operate-btn {
    border: 1px solid $outline !important;
    color: $font_high;
  }
  .border-right-0 {
    border-right: 0 !important;
  }
  .text-info {
    color: $font !important;
  }
}
</style>
