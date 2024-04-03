<script>
import { mapGetters } from 'vuex'
import { get, cloneDeep, omit } from 'lodash'
import Ajax from '@/api/ajax'

import PageHeader from '@/common/pageHeader'
import SearchBox from '@/common/searchBox'
import PagerBar from '@/components/pager'
import RuntimeStatus from '@/common/apps/AppRuntimeStatus'
import PodDeleteButton from '@/common/apps/Operate/PodDeleteButton'
import ShowYaml from '@/common/apps/Operate/ShowYaml'
import StatusInfo from '@/common/apps/Operate/StatusInfo'
import CommonTips from '@/common/tips'
import ColumnSettings from '@/components/columnSettings'
import ContainerStatus from '@/pages/apps/common/container/containerStatus'
import ContainerLog from '@/pages/apps/common/container/containerLog'
import AppStatus from '@/common/apps/AppStatus'
import ResourceColumn from '@/common/resourceColumn'
import EmptyHolder from '@/components/empty'

import { formatPrometheusTableData } from '@/utils/cluster/utils'
import { getPercentage, sortListWithoutNull } from '@/utils/utils'

import { POD_STATUS_MAP } from '@/constant/application'
import { PODS_LIST_TARGETS } from '@/constant/prometheus'

import { PAGINATION } from '@/constant'

const DEFAULT_FILTER = ({
  pod = '',
  node = '',
  qosClass = '',
  status = ''
} = {}) => ({
  pod,
  node,
  qosClass,
  status
})

const CAPACITY_USAGE_COLUMNS = ['cpu', 'memory']

const POD_QUS_CLASS = ['Guaranteed', 'Burstable', 'BestEffort']

export default {
  name: 'application-pods-list',
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
    showGroupFilter: {
      type: Boolean,
      default: true
    },
    hiddenColumns: {
      type: Array,
      default: () => ([])
    },
    hiddenSearch: {
      type: Array,
      default: () => ([])
    },
    propsFilter: Object
  },
  data () {
    return {
      processing: {
        pods: false,
        prometheus: false
      },
      filter: DEFAULT_FILTER(),
      data: [],
      pagination: PAGINATION(),
      filterList: [],
      showColumns: [],
      order: false,
      orderBy: 'creationTime',
      prometheusData: []
    }
  },
  computed: {
    ...mapGetters([
      'lang'
    ]),
    columns () {
      const ret = [
        {
          prop: 'pod',
          label: this.$t('applications.podName'),
          minWidth: 180,
          show: true,
          disabled: true
        },
        {
          prop: 'workloadName',
          label: this.$t('menu.loadbalancer'),
          minWidth: 180,
          show: true
        },
        {
          prop: 'status',
          label: this.$t('common.status'),
          minWidth: 100,
          show: true
        },
        {
          prop: 'creationTime',
          label: this.$t('applications.loadBalancer.createTime'),
          minWidth: 180,
          show: true
        },
        {
          prop: 'containers',
          label: this.$t('applications.container'),
          minWidth: 80,
          show: true
        },
        {
          prop: 'restartCount',
          label: this.$t('applications.restartNum'),
          minWidth: 120,
          show: true,
          align: 'right'
        },
        {
          prop: 'nodeName',
          label: this.$t('applications.runNode'),
          minWidth: 150,
          show: true
        },
        ...this.capacityUsageColumns,
        {
          prop: 'qosClass',
          label: this.$t('applications.qosClass'),
          minWidth: 150,
          show: true,
          tip: 'QOS_CLASS_TIP'
        },
        {
          prop: 'operate',
          label: this.$t('common.operate'),
          minWidth: 220,
          disabled: true,
          show: true
        }
      ]
      return ret.filter(item => item.show && !this.hiddenColumns.includes(item.prop))
    },
    capacityUsageColumns () {
      return CAPACITY_USAGE_COLUMNS.map(item => {
        return {
          prop: item,
          label: this.$t(`common.${item}`),
          minWidth: 140,
          show: true
        }
      })
    },
    podStatusOption () {
      const ret = POD_STATUS_MAP.map(item => {
        return {
          label: this.$t(`applications.podStatusLabel.${item}`),
          value: item
        }
      })
      ret.unshift({ label: this.$t('common.all'), value: '' })
      return ret
    },
    qosClassOptions () {
      const ret = POD_QUS_CLASS.map(item => {
        return {
          label: item,
          value: item
        }
      })
      ret.unshift({ label: this.$t('common.all'), value: '' })
      return ret
    },
    properties () {
      const { qosClassOptions, podStatusOption } = this
      const ret = [
        {
          name: 'pod',
          label: '',
          type: 'input',
          placeholder: `${this.$t('common.search')}${this.$t('applications.app')}${this.$t('applications.podName')}`,
          show: true
        },
        {
          name: 'status',
          label: this.$t('common.status'),
          type: 'select',
          options: podStatusOption,
          show: true
        },
        {
          name: 'qosClass',
          label: this.$t('applications.qosClass'),
          type: 'select',
          options: qosClassOptions,
          show: true
        }
      ]
      return ret.filter(item => item.show && !this.hiddenSearch.includes(item.name))
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
      return ['pod', 'status', 'creationTimestamp', 'restartCount', 'cpuUsed', 'cpuRequestRate', 'cpuLimitRate', 'memUsed', 'memRequestRate', 'memLimitRate']
    },
    appName () {
      return get(this.$route, 'query.application')
    }
  },
  components: {
    PageHeader,
    SearchBox,
    PagerBar,
    RuntimeStatus,
    PodDeleteButton,
    CommonTips,
    ColumnSettings,
    ContainerStatus,
    ContainerLog,
    AppStatus,
    ShowYaml,
    StatusInfo,
    ResourceColumn,
    EmptyHolder
  },
  methods: {
    get,
    getList () {
      const self = this
      const { appName } = this
      appName && new Ajax({
        resource: {
          name: 'GET_APPLICATION_PODS',
          sets: {
            appName
          }
        },
        success (rsp) {
          const l = get(rsp, 'data') || []
          const list = l.map(item => {
            return {
              ...item,
              ...item.metadata,
              pod: get(item.metadata, 'name'),
              workloadName: get(item.workload, 'name'),
              workloadType: get(item.workload, 'kind'),
              status: get(item, 'status.phase'),
              statusInfo: get(item, 'status'),
              containerStatuses: get(item, 'status.containerStatuses', [])
            }
          })
          self.data = list
          self.getFilterList()

          self.$emit('setPodNames', self.filterList.map(item => item.name))
        },
        before () {
          self.data = []
          self.processing.pods = true
        },
        complete () {
          self.processing.pods = false
        }
      }).fetch()
    },
    getPrometheusData () {
      const self = this
      new Ajax({
        resource: 'POST_DASHBOARD_QUERY',
        data: {
          time: Date.now(),
          variables: {},
          targets: PODS_LIST_TARGETS()
        },
        success (rsp = {}) {
          const dataResults = Object.values(rsp.data || {})
          self.prometheusData = formatPrometheusTableData({
            dataResults,
            columns: [
              { key: 'pod', type: 'metric', primary: true },
              { key: 'namespace', type: 'metric', primary: true },
              ...(Object.keys(rsp.data || {}).map(key => ({ key })))
            ]
          })
          self.getFilterList()
        },
        before () {
          self.processing.prometheus = true
        },
        complete () {
          self.processing.prometheus = false
        }
      }).fetch()
    },
    getFilterList () {
      // 目前前端拿到的是全量数据 在后台没有的分页的情况下 直接在前端做筛选
      this.pagination = PAGINATION()
      const { data, filter } = this

      // Step-1: 通过筛选项进行过滤
      let ret = data.filter(item => {
        return Object.keys(filter).every(key => {
          if (!filter[key]) return true
          const filterValue = (filter[key] && filter[key]?.toLowerCase()) || ''
          const itemValue = (item[key] && item[key]?.toLowerCase()) || ''
          if (['pod'].includes(key)) {
            return itemValue.includes(filterValue)
          } else {
            return itemValue === filterValue
          }
        })
      })
      // Step-2: 填充cpu、mem等数据，来自prometheus
      ret = this.formatCapacityData(ret)

      // Step-3: 排序
      const order = this.order ? 'asc' : 'desc'
      ret = sortListWithoutNull({ list: ret, prop: this.orderBy, order })

      this.filterList = ret
      this.pagination.total = this.filterList.length || 0
    },
    formatCapacityData (list) {
      return list.map(item => {
        const ret = item
        const key = `${item.pod}_${item.namespace}`
        const capacityData = this.prometheusData[key] || {}
        return {
          ...ret,
          ...capacityData,
          cpuRequestRate: getPercentage(capacityData.cpuUsed, capacityData.cpuRequest),
          cpuLimitRate: getPercentage(capacityData.cpuUsed, capacityData.cpuLimit),
          memRequestRate: getPercentage(capacityData.memUsed, capacityData.memRequest),
          memLimitRate: getPercentage(capacityData.memUsed, capacityData.memLimit)
        }
      })
    },
    reset () {
      this.filter = DEFAULT_FILTER()

      this.orderBy = 'createTime'
      this.order = false
    },
    isCapacityUsageProp (prop) {
      return CAPACITY_USAGE_COLUMNS.includes(prop)
    },
    toHomepage (val) {
      const application = get(this.$route, 'query.application')
      const bdc = get(this.$route, 'query.bdc')
      const query = {
        pod: val.pod,
        bdc,
        application,
        appForm: get(this.propsFilter, 'appForm')
      }

      const currentCatalog = get(this.$route, 'params.name')

      return {
        path: `/catalogHomepage/${currentCatalog}`,
        query
      }
    },
    getTip (prop) {
      const map = {
        cpu: 'APPLICATION_CPU_USE_REQUEST_LIMIT',
        memory: 'APPLICATION_MEMORY_USE_REQUEST_LIMIT'
      }
      return map[prop]
    },
    handlerSort (val) {
      this.orderBy = val
      this.getFilterList()
    },
    getSortLabel (key) {
      const ret = get(this.columns.find(item => item.prop === key), 'label')
      return !ret ? this.$te(`applications.loadBalancer.${key}`) ? this.$t(`applications.loadBalancer.${key}`) : key : ret
    },
    async refresh () {
      this.getList()
      this.getPrometheusData()
    },
    refreshTable () {
      this.$nextTick(() => {
        const el = this.$refs.podListRef
        el && el.doLayout()
      })
    }
  },
  async mounted () {
    if (this.showSearch) {
      this.filter = DEFAULT_FILTER(this.$route.query)
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

        if (this.showBreadcrumb) {
          const { name, query } = this.$route
          this.$router.push({
            name,
            query: {
              ...query,
              ...omit(val, 'pod')
            }
          })
        }
      }
    },
    order () {
      this.getFilterList()
    },
    lang: {
      immediate: true,
      handler () {
        const data = cloneDeep(this.showColumns.length ? this.showColumns : this.columns)
        this.showColumns = data.map(item => {
          return {
            ...item,
            label: get(this.columns.find(c => c.prop === item.prop), 'label')
          }
        })
      }
    },
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val.length) {
          this.refreshTable()
        }
      }
    }
  }
}
</script>

<template lang="pug">
.application-pods-list
  PageHeader.mb-3(v-if="showBreadcrumb", :data="breadcrumb")
    template(slot="leftAfter")
      .sub-title.ml-2.text-gray {{ $t('applications.podSubTitle') }}
    el-button(
      type="default"
      @click="refresh"
    )
      i.remix.ri-refresh-line
      span {{ $t('common.refresh') }}
  .application-pods-list-container.shadow-box
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
                  span(:class="{ 'text-primary': item === orderBy }") {{ getSortLabel(item) }}
            el-button.operate-btn.mr-2(type="default", @click="order = !order")
              i.remix.mr-0(:class="order ? 'ri-sort-asc' : 'ri-sort-desc'")
            ColumnSettings(v-model="showColumns", @refreshTable="refreshTable")
              el-button.operate-btn(type="default")
                i.remix.ri-settings-3-line.mr-0
    .table-box(v-loading="processing.pods")
      el-table.no-border-table(v-if="tableList.length", :data="tableList", :key="lang", border, ref="podListRef")
        template(
          v-for="({ prop, label, minWidth, show, tip, align }, idx) in showColumns",
        )
          el-table-column(
            v-if="show",
            :key="prop + idx",
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false",
            :align="align"
          )
            template(#header)
              template(v-if="isCapacityUsageProp(prop)")
                .d-block {{ label }}
                .d-flex
                  span {{ $t('applications.loadBalancer.useAndRequestAndLimit') }}
                  CommonTips.ml-1(:name="getTip(prop)")
              .d-flex(v-else)
                span {{ label }}
                CommonTips.ml-1.tip-box(v-if="tip", :name="tip")
            template(slot-scope="scope")
              span(v-if="prop === 'pod'")
                router-link(:to="toHomepage(scope.row)", target="_blank")
                  span {{ scope.row.pod }}
                  i.remix.ri-external-link-line.ml-1(v-if="openNewTab && scope.row.pod")
              span(v-else-if="prop === 'status'")
                AppStatus(:data="scope.row")
                StatusInfo(:data="scope.row", :info="scope.row.statusInfo", type="pod", :title="`${$t('menu.pods')}：${scope.row.pod}`")
              ContainerStatus(v-else-if="prop === 'containers'", :containers="scope.row.containerStatuses")
              span(v-else-if="prop === 'workloadName'")
                .d-block.pod-font {{ scope.row.workloadName | holder('-') }}
                .d-block.text-gray {{ scope.row.workloadType | holder('-') }}
              span(v-else-if="isCapacityUsageProp(prop)")
                ResourceColumn(:type="prop", :row="scope.row")
              span(v-else-if="prop === 'creationTime'") {{ scope.row.creationTime | timeformat }}
              span(v-else-if="prop === 'operate'")
                .d-flex.align-items-center
                  ShowYaml.after-line(:data="{ ...scope.row, appName }", type="pod", :title="`${$t('menu.pods')}：${scope.row.pod}`")
                  ContainerLog(:podData="{ ...scope.row, podName: scope.row.pod, appName,  }")
                  PodDeleteButton.mr-2.before-line(
                    :podData="{ podName: scope.row.pod, appName }",
                    @refresh="refresh"
                  )
              span(v-else) {{ scope.row[prop] | holder('-') }}
      EmptyHolder.m-4(v-else)
      PagerBar(v-if="showPager", :data="pagination")
</template>

<style lang="scss">
@import '~@/root.scss';

.application-pods-list {
  .pod-font {
    color: $font;
  }
  .application-pods-list-container {
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

  .view-log-link {
    line-height: 30px;
  }
}
</style>
