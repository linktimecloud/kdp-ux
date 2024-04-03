<script>
import i18n from '@/i18n'

import Ajax from '@/api/ajax'

import ProcessList from './logs'
import SearchBox from '@/common/searchBox'
import { getProcessTitleText } from '@/pages/record/process/utils'

const WAIT_REFRESH = 10000
let handler
const MAX_RETRY_NUM = 3

export default {
  name: 'process-logs',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      i18n,
      loading: false,
      status: 0,
      pagination: {},
      data: [],

      titleOpt: {
        text: '',
        class: '',
        icon: ''
      },
      filter: {
        keyword: '',
        level: []
      },
      retryNum: 0
    }
  },
  computed: {
    properties () {
      const ret = [
        {
          name: 'keyword',
          label: i18n.t('common.keywordSearch'),
          type: 'input'
        },
        {
          name: 'level',
          label: i18n.t('common.viewLevel'),
          type: 'select',
          clearable: true,
          multiple: true,
          options: [
            {
              label: i18n.t('common.commonLevel'),
              options: [
                { label: 'info', value: 'info' },
                { label: 'error', value: 'error' },
                { label: 'warning', value: 'warning' },
                { label: 'success', value: 'success' }

              ]
            },
            {
              label: i18n.t('common.otherLevel'),
              options: [
                { label: 'fatal', value: 'fatal' },
                { label: 'debug', value: 'debug' },
                { label: 'trace', value: 'trace' },
                { label: 'all', value: 'all' },
                { label: 'off', value: 'off' }
              ]
            }
          ]
        }
      ]
      return ret
    },
    list () {
      const { keyword, level } = this.filter
      let ret = this.data
      if (keyword) {
        const key = keyword.toLowerCase()
        ret = ret.filter((item = {}) => item.content && item.content.toLowerCase().includes(key))
      }
      if (level && level.length) {
        ret = ret.filter(
          (item = {}) =>
            item.level &&
            level.includes(item.level.toLowerCase())
        )
      }
      return ret
    }
  },
  components: {
    ProcessList,
    SearchBox
  },
  methods: {
    resetFilter () {
      this.filter.keyword = ''
      this.filter.level = ''
    },
    getList () {
      const self = this
      const data = {
        ...self.pagination,
        exclude: 'PREDEFINED'
      }
      const pid = self.id
      const resource = {
        name: 'GET_PROCESSES_PID',
        sets: { pid }
      }
      const httpRes = new Ajax({
        resource,
        data,
        success (rsp = {}) {
          const d = rsp.data
          self.pagination = d.pagination || {}
          self.data = d.list || []
          self.status = d.status
          self.$emit('update:status', d.status)

          self.titleOpt.text = getProcessTitleText(d)

          switch (self.status) {
            case 1:
              self.titleOpt.icon = 'el-icon-circle-check'
              self.titleOpt.class = 'text-success'
              self.stop()
              break
            case 2:
              self.titleOpt.icon = 'el-icon-circle-close'
              self.titleOpt.class = 'text-danger'
              self.stop()
              break
            case 0:
              self.titleOpt.icon = 'el-icon-loading'
              self.titleOpt.class = 'text-info'
              break
            default:
              self.titleOpt.icon = 'el-icon-loading'
              self.titleOpt.class = 'text-info'
              break
          }
        },
        before () {
          self.loading = true
        },
        complete () {
          self.loading = false
        },
        toast: self.retryNum >= MAX_RETRY_NUM,
        fail (rsp) {
          if (self.retryNum >= MAX_RETRY_NUM) {
            self.stop()
          }
          self.retryNum++
        }
      })
      !self.loading && httpRes.fetch()
    },
    stop () {
      clearInterval(handler)
    },
    restart () {
      this.stop()
      this.getList()
      handler = setInterval(this.getList, WAIT_REFRESH)
    },
    resetKeyword () {
      this.filter.keyword = ''
    }
  },
  mounted () {
    this.restart()
  },
  beforeDestroy () {
    this.data = []
    this.stop()
  },
  watch: {
    id (id) {
      if (id) {
        this.restart()
      } else {
        this.stop()
      }
    }
  }
}
</script>

<template lang="pug">
.process-logs
  h5(:class="titleOpt.class")
    i.mr-1(:class="titleOpt.icon")
    span(v-if="titleOpt.text") {{ titleOpt.text }}, {{ status | processStatus }}
    span(v-else) {{ i18n.t('common.loading') }}
  SearchBox.mb-2.p-0.border-0.resource-search-box(
    :data="filter",
    :properties="properties",
    :actionBtns="[{ value: 'reset', label: i18n.t('common.reset'), type: 'default' }]",
    @reset="resetFilter"
  )
  ProcessList(:data="list", :keyword="filter.keyword")
</template>
