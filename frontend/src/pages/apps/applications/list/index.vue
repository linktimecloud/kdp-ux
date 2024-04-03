<script>
import { mapGetters, mapActions } from 'vuex'
import { get, orderBy, cloneDeep, isEmpty } from 'lodash'
import Ajax from '@/api/ajax'

import PageHeader from '@/common/pageHeader'
import SearchBox from '@/common/searchBox'
import PagerBar from '@/components/pager'
import AppStatus from '@/common/apps/AppRuntimeStatus'
import UpdateConfigButton from '@/common/apps/Operate/UpdateConfigButton'
import UninstallButton from '@/common/apps/Operate/UninstallButton'
import ColumnSettings from '@/components/columnSettings'
import StatusInfo from '@/common/apps/Operate/StatusInfo'
import ExportCsv from '@/common/exportCsv'
import BdcAppStatus from '@/common/cluster/bdcStatus'

import { saveCsvFile } from '@/utils/file'
import { SYSTEM_APPLICATION_STATUS } from '@/constant/application'
import { PAGINATION } from '@/constant'
import { getExportCsvDataFromAppList } from '@/utils/app'

const DEFAULT_FILTER = () => ({
  name: '',
  status: '',
  catalog: '',
  catalogType: ''
})

export default {
  name: 'application-list',
  props: {
    breadcrumb: {
      type: Object,
      default: () => ({})
    },
    showBreadcrumb: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    showPager: {
      type: Boolean,
      default: true
    },
    openNewTab: {
      type: Boolean,
      default: false
    },
    refreshFlag: Number,
    hiddenColumns: {
      type: Array,
      default: () => ([])
    },
    hiddenSearch: {
      type: Array,
      default: () => ([])
    },
    propsFilter: {
      type: Object,
      default: () => ({})
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    resourceType: {
      type: String,
      default: 'all' // all/bdc/system
    },
    defaultOrderBy: {
      type: String,
      default: ''
    },
    showExportCsv: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      processing: false,
      filter: DEFAULT_FILTER(),
      data: [],
      pagination: PAGINATION(),
      filterList: [],
      showColumns: [],
      order: false,
      orderBy: 'updateTime',
      bdcList: []
    }
  },
  computed: {
    ...mapGetters([
      'isAdmin',
      'lang',
      'userOrgName'
    ]),
    ...mapGetters('moduleCluster', [
      'catalogTypeList',
      'catalogTypesData'
    ]),
    ...mapGetters('moduleSecurity', [
      'groupOptions'
    ]),
    systemApplicationStatus () {
      return SYSTEM_APPLICATION_STATUS()
    },
    columns () {
      const ret = [
        {
          prop: 'name',
          label: this.$t('applications.renderApp'),
          minWidth: 180,
          show: true,
          disabled: true
        },
        {
          prop: 'bdc',
          label: this.$t('menu.bigDataCluster'),
          minWidth: 150,
          show: true
        },
        {
          prop: 'catalog',
          label: this.$t('applications.loadBalancer.appCatalog'),
          minWidth: 150,
          show: true
        },
        {
          prop: 'status',
          label: this.$t('common.status'),
          minWidth: 130,
          show: true
        },
        {
          prop: 'updateTime',
          label: this.$t('applications.lastOperationTime'),
          minWidth: 170,
          show: true
        },
        {
          prop: 'operate',
          label: this.$t('common.operate'),
          width: 170,
          disabled: true,
          show: true
        }
      ]
      return ret.filter(item => !this.hiddenColumns.includes(item.prop))
    },
    properties () {
      const { systemApplicationStatus } = this
      const ret = [
        {
          name: 'name',
          label: '',
          type: 'input',
          placeholder: `${this.$t('common.search')}${this.$t('applications.renderApp')}`
        },
        {
          name: 'status',
          label: this.$t('common.status'),
          type: 'select',
          options: systemApplicationStatus
        },
        {
          name: 'catalog',
          label: this.$t('catalogs.name'),
          type: 'input',
          placeholder: this.$t('common.input')
        },
        {
          name: 'catalogType',
          label: this.$t('catalogs.type'),
          type: 'select',
          allowCreate: true,
          options: [{ value: '', label: this.$t('common.all') }, ...this.catalogTypeList]
        }
      ]
      return ret.filter(item => !this.hiddenSearch.includes(item.name))
    },
    tableList () {
      const { filterList, pagination: { limit, start }, showPager } = this
      let ret = filterList
      if (showPager) {
        ret = ret.slice(start, start + limit)
      }
      return ret
    },
    total () {
      return this.filterList.length || 0
    },
    sortMap () {
      return ['name', 'catalog', 'status', 'updateTime'].filter(item => !this.hiddenColumns.includes(item))
    }
  },
  components: {
    PageHeader,
    SearchBox,
    PagerBar,
    AppStatus,
    UpdateConfigButton,
    UninstallButton,
    ColumnSettings,
    StatusInfo,
    ExportCsv,
    BdcAppStatus
  },
  methods: {
    get,
    ...mapActions('moduleCluster', [
      'getCatalogTypes'
    ]),
    getList () {
      const self = this
      new Ajax({
        resource: 'GET_CATALOGS_APP_FORMS_APPS',
        data: {
          ...self.propsFilter
        },
        success (rsp) {
          const list = get(rsp, 'data') || []
          self.data = list.map(item => {
            return {
              ...item,
              catalogType: get(self.catalogTypesData.find(c => c.name.toLowerCase() === item.catalog), 'category'),
              statusInfo: get(item, 'status') || {},
              status: get(item, 'status.status'),
              bdc: get(item, 'bdc.name'),
              bdcStatus: get(item, 'bdc.status'),
              updateTime: get(item, 'updateTime') || get(item, 'createTime')
            }
          })
          self.getFilterList()
        },
        fail () {
          self.data = []
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
          self.refreshTable()
        }
      }).fetch()
    },
    getFilterList () {
      this.pagination = PAGINATION()
      const { data, filter, properties } = this
      // 目前前端拿到的是全量数据 在后台没有的分页的情况下 直接在前端做筛选
      const filterKeys = properties.map(p => {
        return p.name
      })
      this.filterList = data.filter(item => {
        return filterKeys.every(key => {
          if (!filter[key]) return true
          const filterValue = (filter[key] && filter[key].toLowerCase()) || ''
          const itemValue = (item[key] && item[key].toLowerCase()) || ''
          if (['name', 'catalog'].includes(key)) {
            return itemValue.includes(filterValue)
          } else if (key === 'catalogType' && filterValue === 'other') {
            return !itemValue || itemValue === 'other'
          } else {
            return itemValue === filterValue
          }
        })
      })
      const order = this.order ? 'asc' : 'desc'
      this.filterList = orderBy(this.filterList, [this.orderBy], [order])
      this.pagination.total = this.filterList.length || 0
    },
    exportCsv () {
      const { filterList, columns, bdcList } = this
      const data = getExportCsvDataFromAppList({ list: filterList, columns, type: 'application', bdcList })
      saveCsvFile(data, this.$t('applications.instance'))
    },
    reset () {
      this.filter = DEFAULT_FILTER()

      this.initGname()
      this.orderBy = this.defaultOrderBy || 'updateTime'
      this.order = false
    },
    handlerSort (val) {
      this.orderBy = val
      this.getFilterList()
    },
    getSortLabel (key) {
      return get(this.columns.find(item => item.prop === key), 'label')
    },
    allowOperate (status) {
      return status !== 'stopping'
    },
    refreshTable () {
      this.$nextTick(() => {
        const el = this.$refs.applicationListRef
        el && el.doLayout()
      })
    },
    refresh () {
      this.getList()
    },
    toAppDetail (row) {
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
    },
    initGname () {
      this.filter.group = this.userOrgName
    }
  },
  mounted () {
    if (isEmpty(this.catalogTypesData)) {
      this.getCatalogTypes()
    }

    this.initGname()
    if (this.defaultOrderBy) {
      this.orderBy = this.defaultOrderBy
    }

    this.refresh()
  },
  watch: {
    refreshFlag () {
      this.refresh()
    },
    filter: {
      deep: true,
      handler (val) {
        this.getFilterList()
      }
    },
    'filter.group' (val) {
      this.filter.bdc = ''
    },
    order () {
      this.getFilterList()
    },
    lang: {
      immediate: true,
      handler () {
        this.getCatalogTypes()
        const data = cloneDeep(this.showColumns.length ? this.showColumns : this.columns)
        this.showColumns = data.map(item => {
          return {
            ...item,
            label: get(this.columns.find(c => c.prop === item.prop), 'label')
          }
        })
      }
    }
  }
}
</script>

<template lang="pug">
.application-list
  PageHeader(v-if="showBreadcrumb", :data="breadcrumb")
    el-button(
      type="default"
      @click="refresh"
    )
      i.remix.ri-refresh-line
      span {{ $t('common.refresh') }}
    ExportCsv.ml-2(:disabled="processing || !filterList.length", @exportCsv="exportCsv")
  .application-list-container.shadow-box
    template(v-if="showSearch")
      SearchBox.border-0(
        :data="filter",
        :properties="properties",
        :actionBtns="[{ value: 'reset', label: $t('common.reset'), type: 'default' }]",
        theme="light",
        @reset="reset"
      )
        template(name="searchAfter")
          .d-flex.align-items-center
            el-dropdown(@command="handlerSort")
              el-button.operate-btn.pr-1.border-right-0(type="default")
                span {{ $t('common.sort') }}：{{ getSortLabel(orderBy) }}
                i.el-icon-arrow-down.text-gray
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(v-for="item in sortMap", :key="item", :command="item",)
                  span(:class="{ 'text-primary': item === orderBy }") {{ getSortLabel(item) || item }}
            el-button.operate-btn.mr-2(type="default", @click="order = !order")
              i.remix.mr-0(:class="order ? 'ri-sort-asc' : 'ri-sort-desc'")
            ColumnSettings(v-model="showColumns", @refreshTable="refreshTable")
              el-button.operate-btn(type="default")
                i.remix.ri-settings-3-line.mr-0
            el-button.operate-btn.ml-2(v-if="showRefresh", type="default", @click="refresh")
              i.remix.mr-0.ri-refresh-line
            ExportCsv.ml-2(v-if="showExportCsv", :disabled="processing || !filterList.length", @exportCsv="exportCsv")
    .table-box(v-loading="processing")
      el-table.no-border-table(:data="tableList", :key="lang", border, ref="applicationListRef")
        template(
          v-for="({ prop, label, minWidth, show, width }, idx) in showColumns",
        )
          el-table-column(
            v-if="show",
            :key="prop + idx",
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :width="width",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false"
          )
            template(slot-scope="scope")
              span(v-if="prop === 'name'")
                router-link.d-block(:to="toAppDetail(scope.row)", target="_blank")
                  span {{ scope.row.name }}
                  i.remix.ri-external-link-line.ml-1(v-if="openNewTab && scope.row.name")
              span(v-else-if="prop === 'bdc'")
                template(v-if="scope.row.bdc")
                  span {{ scope.row.bdc | holder('-') }}
                  BdcAppStatus(:status="scope.row.bdcStatus", sign="appBdcNotReadyTip")
                span(v-else) -
              span(v-else-if="prop === 'status'")
                AppStatus(:status="scope.row.status", :overrideTypes="systemApplicationStatus")
                StatusInfo(
                  :data="{ ...scope.row, appName: scope.row.name }",
                  :info="scope.row.statusInfo",
                  type="instance",
                  :title="`${$t('applications.instance')}：${scope.row.name}`"
                )
              span(v-else-if="prop === 'updateTime'") {{ scope.row.updateTime | timeformat }}
              span(v-else-if="prop === 'catalog'")
                router-link.d-block.text-info(v-if="scope.row.catalog", :to="`/catalogHomepage/${scope.row.catalog}`", target="_blank")
                  span {{ scope.row.catalog }}
                  i.remix.ri-external-link-line.ml-1
                .d-block(v-else) -
                .d-block
                  span.text-gray {{ scope.row.catalogType | holder('-') }}
              span(v-else-if="prop === 'operate'")
                .d-flex.align-items-center
                  UpdateConfigButton.after-line(
                    v-if="allowOperate(scope.row.status)",
                    :data="scope.row"
                  )
                  el-dropdown
                    el-button(type="text")
                      .d-flex.align-items-center
                        span {{ $t('common.more') }}
                        i.el-icon-arrow-down
                    el-dropdown-menu.dropdown-menu-full-button(slot="dropdown")
                      el-dropdown-item
                        router-link(:to="{ name: 'process', query: { name: scope.row.name } }", target="_blank")
                          .d-flex.more-btn
                            i.remix.ri-external-link-line
                            span {{ $t('menu.process') }}
                      el-dropdown-item(v-if="allowOperate(scope.row.status)")
                        UninstallButton(
                          :appName="scope.row.name",
                          :group="scope.row.group",
                          :bdc="scope.row.bdc",
                          @refresh="refresh"
                        )
                          .d-flex.more-btn
                            i.remix.ri-uninstall-line
                            span {{ $t('common.uninstall') }}
              span(v-else) {{ scope.row[prop] | holder('-') }}
      PagerBar(v-if="showPager", :data="pagination")
</template>

<style lang="scss">
@import '~@/root.scss';

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
