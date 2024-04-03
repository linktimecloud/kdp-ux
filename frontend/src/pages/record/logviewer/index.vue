<script>
import Ajax from '@/api/ajax'
import { mapGetters } from 'vuex'

/**
 * import content templates
 */
import { get, isPlainObject, debounce, omit } from 'lodash'

import BreadCrumb from '@/common/pageHeader'
import DateTimePickeShort from '@/common/dateTimePicker/shortTime'
import Logs from '@/common/process/logs'
import LogSearchBox from '@/pages/record/common/LogSearch'

import { saveCsvFile } from '@/utils/file'
import { strFull } from '@/utils/utils'
import { LOG_LIST_TARGETS } from '@/constant/prometheus'
import { rawToDataResults } from '@/common/dashboard/panelCard/utils'

const DEFAULT_LOG_FILTER = () => ({
  namespace: '',
  app: '',
  pod: '.+',
  container: '.+',
  keyword: '',
  podNames: ''
})

export default {
  name: 'log-viewer',
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
    ...mapGetters([
      'isAdmin',
      'userOrgName'
    ]),
    breadcrumb () {
      return {
        name: 'logviewer',
        text: 'menu.logviewer'
      }
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
  components: {
    BreadCrumb,
    DateTimePickeShort,
    LogSearchBox,
    Logs
  },
  methods: {
    updateTime () {
      this.timeQuery.time = Date.now()
      this.fetchDebounce()
    },
    downloadStd () {
      const data = this.formatBeforeDownload(this.dataResults)
      const now = strFull()
      saveCsvFile(data, `std-log-${now}`)
    },
    downloadFile () {
      const data = this.formatBeforeDownload(this.dataResults)

      const now = strFull()
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
      this.refreshDateTimeFlag = Date.now()
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

      new Ajax({
        resource: 'POST_DASHBOARD_QUERY_RANGE',
        data: d,
        success (rsp = {}) {
          const rspData = rsp.data || {}
          self.dataResults = rawToDataResults(rspData, targets, 'POD_LOG_FILEERR_LOGS')
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        },
        fail () {
          self.dataResults = []
        }
      }).fetch()
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
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')
    this.initFilter()

    this.isReadyFilter = true
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
  }
}
</script>

<template lang="pug">
.log-viewer
  BreadCrumb(
    :data="breadcrumb"
  )
    .d-flex.align-items-center
      el-button(@click="updateTime").border-0.mr-2
        i.mr-0.remix.ri-refresh-line
      el-dropdown
        el-button(type="primary")
          span.mr-2 {{ $t('common.export') }}
          i.remix.ri-arrow-down-s-line.mr-0
        el-dropdown-menu(slot="dropdown")
          el-dropdown-item(
            :disabled="!dataResults.length",
            @click.native="downloadStd"
          ) {{ $t('log.exportStdLog') }}
          el-dropdown-item(
            :disabled="!dataResults.length",
            @click.native="downloadFile"
          ) {{ $t('log.exportFileLog') }}
  .tip-box.mb-3.p-2(v-if="showTipBox")
    .d-flex.justify-content-between
      span.font-weight-bold {{ $t('common.attention') }}:
      i.text-gray.cursor-pointer.ri-close-line(@click="showTipBox = false")
    .d-block 1. {{ $t('log.rangeLimitTip') }}
    .d-block 2. {{ $t('log.limitTip') }}
  LogSearchBox(
    v-if="isReadyFilter",
    :filter="filter",
    @reset="resetFilter"
  )
    DateTimePickeShort(
      v-model="timeQuery.range",
      :defaultShortcutLable="defaultShortcutLable",
      :shortcutList="shortcutList",
      :refreshFlag="refreshDateTimeFlag",
      @input="val => timeQuery.range = val",
      :hiddenClearBtn="true"
    )
  .dashboard-wrapper(v-loading="processing")
    Logs.logs-container(
      :data="dataResults",
      :keyword="filter.keyword",
      :showInfinite="true",
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
