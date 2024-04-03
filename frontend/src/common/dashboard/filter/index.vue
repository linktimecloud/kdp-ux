<script>
import { isPlainObject, cloneDeep } from 'lodash'
import i18n from '@/i18n'

import Ajax from '@/api/ajax'
import SearchBox from '@/common/searchBox'
import { ONE_MINUTE_AS_MS } from '@/constant'

import { removeEmptyObjKey, isIndependendExpr, isLabelExprReady, isRequiredVarChange } from './utils'

export default {
  name: 'dashboard-filter',
  props: {
    tplList: {
      type: Array,
      required: true
    },
    filter: {
      type: Object,
      default: () => ({})
    },
    actionBtns: {
      type: Array,
      default: () => ([{ value: 'reset', label: i18n.t('common.reset'), type: 'default' }])
    },
    clearable: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data () {
    return {
      lastTimeFilter: {},
      templatingList: []
    }
  },
  watch: {
    filter: {
      deep: true,
      handler (newFilter) {
        const self = this
        const { templatingList, lastTimeFilter: oldFilter } = self

        if (!templatingList.length) {
          return
        }

        const newVars = removeEmptyObjKey(newFilter)

        const dependentList = templatingList
          .filter(config => config.type === 'select' && config.query)
          .filter(config => !isIndependendExpr(config.query))

        // 缺依赖的选项框： 值和options都要确保为空
        dependentList
          .filter(config => !isLabelExprReady(config.query, newVars))
          .forEach(config => {
            if (newFilter[config.name]) {
              newFilter[config.name] = ''
            }
            if (config.options.length) {
              config.options = []
            }
          })

        // 不缺依赖的选项框：
        // 依赖值变化了 - options 重新请求赋值 ，filter 值设为空
        // 依赖值没有变 - 什么都不做
        dependentList
          .filter(config => isLabelExprReady(config.query, newVars))
          .forEach(config => {
            if (isRequiredVarChange({
              query: config.query,
              newFilter,
              oldFilter
            })) {
              self.requestFilterOptions(config)
            }
          })

        self.lastTimeFilter = { ...newFilter }
      }
    }
  },
  computed: {
    properties () {
      const { templatingList } = this

      if (!templatingList || !templatingList.length) {
        return []
      }

      // 将 templatingList 转为 properties for SearchBox
      const result = templatingList.map(item => {
        const ret = item
        const isSelectType = item.type === 'select'

        const getLabel = v => this.$te(`dashboard.${v}`) ? this.$t(`dashboard.${v}`) : v

        if (isSelectType) {
          ret.options = item.options.length
            ? item.options.map(v =>
              isPlainObject(v)
                ? v
                : {
                    label: ['.+', '.*'].includes(v)
                      ? this.$t('common.all')
                      : getLabel(v),
                    value: v
                  }
            )
            : []

          ret.multiple = item.multi
          ret.clearable = this.clearable
          ret.disabled = !ret.options.length
        } else {
          ret.type = item.type || 'input'
          if (item.options) {
            ret.options = item.options
          }

          if (item.optionsKey && item.optionsKey.length) {
            ret.options = item.optionsKey.map(v => ({
              label: getLabel(v),
              value: v
            }))
          }
        }

        return this.transformI18n(ret)
      })

      return result
    }
  },
  components: {
    SearchBox
  },
  methods: {
    init () {
      const templatingList = this.templatingList
      if (!templatingList.length) {
        return
      }

      const { filter } = this

      templatingList.forEach((item) => {
        if (item.type !== 'select' || !item.query) {
          return
        }

        const noDepend = isIndependendExpr(item.query)

        if (noDepend || isLabelExprReady(item.query, filter)) {
          this.requestFilterOptions(item)
        }
      })
    },

    requestFilterOptions (config) {
      const { filter } = this
      const variables = removeEmptyObjKey(filter)

      return new Ajax({
        resource: 'POST_DASHBOARD_LABELS',
        data: {
          // 最近十五分钟
          ...config,
          start: Date.now() - ONE_MINUTE_AS_MS * 15,
          end: Date.now(),
          expr: config.query,
          label: config.name.toLowerCase(),
          variables,
          datasourceType: config.datasourceType || 'loki'
        },
        success (rsp) {
          const data = rsp.data || []
          if (!data.length || !config.allValue) {
            config.options = data
            return
          }

          data.unshift(isPlainObject(data[0]) ? { label: this.$t('common.all'), value: config.allValue } : config.allValue)
          config.options = data
        }
      }).fetch()
    },

    transformI18n (item) {
      const { label, labelTips, options } = cloneDeep(item)
      const { $te, $t } = this
      const getLabel = key => $te(`dashboard.${key}`) ? $t(`dashboard.${key}`) : key

      const ret = {
        ...item,
        label: getLabel(label)
      }

      if (labelTips) ret.labelTips = getLabel(labelTips)
      if (options) ret.options = options.map(o => ({...o, label: getLabel(o.label)}))

      return ret
    }
  },
  mounted () {
    this.lastTimeFilter = cloneDeep(this.filter)
    const { tplList } = this
    if (tplList) {
      this.templatingList = cloneDeep(tplList)
      this.init()
    }
  }
}
</script>

<template lang="pug">
.logviewer-filter
  SearchBox.border-0.resource-search-box(
    v-if="properties.length"
    :data="filter",
    :properties="properties",
    :actionBtns="actionBtns",
    :theme="theme"
    @reset="$emit('reset')",
    @refresh="$emit('refresh')"
  )
    template(slot="searchAfter")
      slot
</template>
