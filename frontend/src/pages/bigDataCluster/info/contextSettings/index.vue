<script>
import { mapGetters } from 'vuex'
import { get, orderBy, cloneDeep, keys, isEmpty } from 'lodash'
import Ajax from '@/api/ajax'

import PagerBar from '@/components/pager'
import ViewContextSettingsButton from '../common/viewContextSettings.vue'
import ReasonButton from '@/common/reasonButton'

import { PAGINATION } from '@/constant'

export default {
  name: 'applicationContextSettings',
  props: {
    refreshFlag: Number,
    propsFilter: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'applicationSetting' // applicationSetting/applicationSecret
    }
  },
  data () {
    return {
      processing: {
        list: false,
        import: false
      },
      data: [],
      showColumns: [],
      pagination: PAGINATION(),
      orderBy: 'createTime',
      order: false
    }
  },
  computed: {
    ...mapGetters([
      'lang'
    ]),
    bdc () {
      return get(this.propsFilter, 'bdc') || ''
    },
    columns () {
      return [
        {
          prop: 'name',
          label: this.$t('common.name'),
          minWidth: 180
        },
        {
          prop: 'origin',
          label: this.$t('common.origin'),
          minWidth: 100
        },
        {
          prop: 'type',
          label: this.$t('common.settingsType'),
          minWidth: 150
        },
        {
          prop: 'keys',
          label: this.$t('common.key'),
          minWidth: 150
        },
        {
          prop: 'createTime',
          label: this.$t('common.createdAt'),
          minWidth: 150
        }
      ]
    },
    tableList () {
      const { filterList, pagination: { limit, start } } = this
      let ret = filterList || []
      ret = ret.slice(start, start + limit)
      return ret
    },
    total () {
      return this.filterList.length || 0
    },
    currentTypeResource () {
      return {
        applicationSetting: {
          title: this.$t('applications.applicationUsedSettings'),
          list: 'GET_BDC_CONTEXT_SETTINGS',
          typeLabel: this.$t('common.settingsType'),
          category: 'bigDataClusterApplicationContextSetting'
        },
        applicationSecret: {
          title: this.$t('applications.applicationSecret'),
          list: 'GET_BDC_CONTEXT_SECRETS',
          typeLabel: `${this.$t('cluster.secret')}${this.$t('common.type')}`,
          category: 'bigDataClusterApplicationSecret'
        }
      }[this.type]
    }
  },
  components: {
    PagerBar,
    ReasonButton,
    ViewContextSettingsButton
  },
  methods: {
    get,
    getList () {
      const self = this
      const { propsFilter: { bdc: bdcName } } = this
      return bdcName && new Ajax({
        resource: self.currentTypeResource.list,
        data: {
          bdcName
        },
        success (rsp) {
          self.data = get(rsp, 'data') || []
          self.getFilterList()
        },
        fail () {
          self.data = []
        },
        before () {
          self.processing.list = true
        },
        complete () {
          self.processing.list = false
          self.refreshTable()
        }
      }).fetch()
    },
    getFilterList () {
      this.pagination = PAGINATION()
      const { data } = this
      // 目前前端拿到的是全量数据 在后台没有的分页的情况下 直接在前端做筛选
      this.filterList = data
      const order = this.order ? 'asc' : 'desc'
      this.filterList = orderBy(this.filterList, [this.orderBy], [order])
      this.pagination.total = this.filterList.length || 0
    },
    refreshTable () {
      this.$nextTick(() => {
        const el = this.$refs.bigDataClusterListRef
        el && el.doLayout()
      })
    },
    getKeys (item) {
      const keysObj = get(item, 'properties') || {}
      return !isEmpty(keysObj) && ((keys(keysObj).join()) || [])
    },
    getOrigin (item) {
      const origin = get(item, 'origin') || 'manual'
      return this.$te(`cluster.contextSettingOrigin.${origin}`) ? this.$t(`cluster.contextSettingOrigin.${origin}`) : ''
    }
  },
  mounted () {
    this.getList()
  },
  watch: {
    refreshFlag () {
      this.getList()
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
    }
  }
}
</script>

<template lang="pug">
.application-context-settings
  .application-context-settings-container.shadow-box
    .table-box(v-loading="processing.list")
      el-table.no-border-table(
        :data="tableList",
        :key="lang",
        border,
        ref="bigDataClusterListRef"
      )
        template(
          v-for="({ prop, label, minWidth, show, width }, idx) in showColumns",
        )
          el-table-column(
            :key="prop + idx",
            :prop="prop",
            :label="label",
            :minWidth="minWidth",
            :width="width",
            :fixed="!idx ? 'left' : prop === 'operate' ? 'right' : false"
          )
            template(slot-scope="scope")
              ViewContextSettingsButton(v-if="prop === 'name'", :data="{ ...scope.row }", :type="type")
                span {{ scope.row.name | holder('-') }}
              span(v-else-if="prop === 'origin'") {{ getOrigin(scope.row) | holder('-') }}
              span(v-else-if="prop === 'type'") {{ scope.row.type | holder('-') }}
              span(v-else-if="prop === 'keys'") {{ getKeys(scope.row) | holder('-') }}
              span(v-else-if="prop === 'createTime'") {{ scope.row.createTime | timeformat }}
              span(v-else) {{ scope.row[prop] | holder('-') }}
      PagerBar(:data="pagination")
</template>
