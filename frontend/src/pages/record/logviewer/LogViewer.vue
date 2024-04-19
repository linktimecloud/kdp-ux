<script>
import { get, isPlainObject, debounce, omit } from 'lodash'

import PageHeader from '@/components/header/PageHeader.vue'
import DateTimePickeShort from '@/common/dateTimePicker/ShortTime.vue'
import Logs from '@/common/process/LogList.vue'
import LogSearchBox from '@/pages/record/common/LogSearch.vue'

import { saveCsvFile } from '@/utils/file'
import { timeformat } from '@/utils/utils'
import { LOG_LIST_TARGETS } from '@/constant/prometheus'
import { rawToDataResults } from '@/common/dashboard/panelCard/utils'

import { postDashboardQueryRangeAPI } from '@/api/dashboard'

import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()

const DEFAULT_LOG_FILTER = () => ({
  namespace: '',
  app: '',
  pod: '.+',
  container: '.+',
  keyword: '',
  podNames: ''
})

export default {
  name: 'LogViewer',
  components: {
    PageHeader,
    DateTimePickeShort,
    LogSearchBox,
    Logs
  },
  data () {
    return {
      filter: DEFAULT_LOG_FILTER(),
      timeQuery: {
        time: Date.now(),
        range: [Date.now() - 1000 * 60 * 5, Date.now()]
      },
      dataResults: [],
      processing: false,
      showTipBox: true,
      refreshDateTimeFlag: Date.now(),
      isReadyFilter: false
    }
  },
  computed: {
    idAdmin () {
      return globalStore.isAdmin
    },
    userOrgName () {
      return globalStore.userOrgName
    },
    defaultShortcutLable () {
      return get(this.$route, 'query.isOneHour') ? this.$t('time.lastestOneHour') : this.$t('time.lastestMinutes', { number: 5 })
    },
    shortcutList () {
      const { pod, container } = this.filter
      const ret = [
        { label: this.$t('time.lastestMinutes', { number: 5 }), duration: 1000 * 60 * 5 },
        { label: this.$t('time.lastestMinutes', { number: 15 }), duration: 1000 * 60 * 15 },
        { label: this.$t('time.lastestMinutes', { number: 30 }), duration: 1000 * 60 * 30 },
        { label: this.$t('time.lastestOneHour'), duration: 1000 * 60 * 60, rangeTooLongTips: this.$t('log.rangeOneHourTips') }
      ]

      if (!(pod === '.+' && container === '.+')) {
        return ret.concat([
          { label: this.$t('time.lastestSixHours'), duration: 1000 * 60 * 60 * 6 },
          { label: this.$t('time.lastestTwelveHours'), duration: 1000 * 60 * 60 * 12, rangeTooLongTips: this.$t('log.rangeTwelveHoursTips') }
        ])
      }
      return ret
    }
  },
  watch: {
    filter: {
      deep: true,
      handler () {
        this.fetchDebounce()
      }
    },
    'timeQuery.range' (val) {
      this.fetchDebounce()

      const { duration, rangeTooLongTips } = this.shortcutList[this.shortcutList.length - 1]
      const [start, end] = val || {}
      if (start && end && end - start > duration) {
        this.$message({
          type: 'warning',
          message: rangeTooLongTips,
          duration: 3000
        })
      }
    }
  },
  mounted () {
    this.initFilter()
    this.isReadyFilter = true
  },
  methods: {
    updateTime () {
      this.timeQuery.time = Date.now()
      this.fetchDebounce()
    },
    downloadStd () {
      const data = this.formatBeforeDownload(this.dataResults)
      const now = timeformat()
      saveCsvFile(data, `std-log-${now}`)
    },
    downloadFile () {
      const data = this.formatBeforeDownload(this.dataResults)

      const now = timeformat()
      saveCsvFile(data, `file-log-${now}`)
    },
    formatBeforeDownload (d) {
      const dataResults = d || []
      return dataResults.map(obj => {
        let ret = {}
        for (const k in obj) {
          ret = isPlainObject(obj[k])
            ? {...ret, ...obj[k]}
            : {...ret, [k]: obj[k]}
        }

        return ret
      })
    },
    resetFilter (overideData) {
      this.filter = {
        ...DEFAULT_LOG_FILTER(),
        ...overideData
      }
      this.timeQuery.range = [Date.now() - 1000 * 60 * 5, Date.now()]
    },
    getLogData () {
      const self = this
      const { timeQuery: { time, range }, filter } = self
      const targets = LOG_LIST_TARGETS()

      // 如果pod选择全部，则这里需要转换一下，传递指定应用实例下的pod names
      const variablePod = filter.pod === '.+' ? filter.podNames : filter.pod

      const d = {
        time: time || Date.now(),
        start: range[0],
        end: range[1],
        variables: {
          ...omit(this.filter, 'podNames'),
          pod: variablePod
        },
        targets
      }

      if (!variablePod) {
        self.dataResults = []
        return
      }

      self.processing = true

      postDashboardQueryRangeAPI(d).then(rsp => {
        const rspData = rsp.data || {}
        self.dataResults = rawToDataResults(rspData, targets, 'POD_LOG_FILEERR_LOGS')
      }).catch(() => {
        self.dataResults = []
      }).finally(() => {
        self.processing = false
      })
    },
    initFilter () {
      const query = this.$route.query
      this.filter = {
        ...DEFAULT_LOG_FILTER(),
        ...query
      }
      if (query.isOneHour) {
        this.timeQuery.range = [Date.now() - 1000 * 60 * 60, Date.now()]
      }
    },
    fetchDebounce: debounce(function () {
      this.getLogData()
    }, 500)
  }
}
</script>

<template lang="pug">
.log-viewer
  PageHeader(
    :data="{ content: $t('menu.logviewer') }",
  )
    .flex.items-center
      el-button(@click="updateTime").border-0.mr-2
        i.mr-0.remix.ri-refresh-line
      el-dropdown
        el-button(type="primary")
          span.mr-2 {{ $t('common.export') }}
          i.remix.ri-arrow-down-s-line.mr-0
        template(#dropdown)
          el-dropdown-menu
            el-dropdown-item(
              :disabled="!dataResults.length",
              @click="downloadStd"
            ) {{ $t('log.exportStdLog') }}
            el-dropdown-item(
              :disabled="!dataResults.length",
              @click="downloadFile"
            ) {{ $t('log.exportFileLog') }}
  .tip-box.mb-3.p-2(v-if="showTipBox")
    .flex.justify-between
      span.font-bold {{ $t('common.attention') }}:
      i.text-gray.cursor-pointer.ri-close-line(@click="showTipBox = false")
    .d-block 1. {{ $t('log.rangeLimitTip') }}
    .d-block 2. {{ $t('log.limitTip') }}
  LogSearchBox(
    v-if="isReadyFilter",
    :filter="filter",
    @change="val => filter = val"
    @reset="resetFilter"
  )
    DateTimePickeShort(
      v-model="timeQuery.range",
      :default-shortcut-lable="defaultShortcutLable",
      :shortcut-list="shortcutList",
      :hidden-clear-btn="true"
    )
  .dashboard-wrapper(v-loading="processing")
    Logs.logs-container(
      :data="dataResults",
      :keyword="filter.keyword",
      :show-infinite="true",
      :class="showTipBox ? 'show-tip-height' : ''"
    )
</template>

<style lang="scss">
.log-viewer {
  .el-loading-spinner {
    top: 100px;
  }
  .tip-box {
    background: rgba(65, 106, 255, 0.05);
    border: 1px solid #8daaff;
    border-radius: 2px;
  }

  .logs-container {
    .infinite-list-wrapper {
      max-height: calc(100vh - 240px);
      overflow-y: auto;
    }
    &.show-tip-height .infinite-list-wrapper {
      max-height: calc(100vh - 330px);
    }
  }
}
</style>
