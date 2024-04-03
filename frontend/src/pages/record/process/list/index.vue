<script>
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'

import Ajax from '@/api/ajax'

import PageHeader from '@/common/pageHeader'
import EmptyHolder from '@/components/empty'
import PagerBar from '@/components/pager'
import DateTimePickeShort from '@/common/dateTimePicker/shortTime'

import { PAGINATION, ONE_DAY_AS_MS } from '@/constant'
import { getProcessTitleText } from '../utils'

import FilterBox from './filter'

const FILTER_INITAL_FORM = () => ({
  name: '',
  status: [],
  handle: '',
  timeRange: []
})

export default {
  name: 'process-list',
  data () {
    return {
      filter: FILTER_INITAL_FORM(),
      breadcrumb: {
        name: 'process',
        text: 'menu.process'
      },
      pagination: PAGINATION(),
      data: [],
      processing: false
    }
  },
  computed: {
    ...mapGetters([
      'route',
      'lang'
    ]),
    list () {
      const self = this
      return (self.data || []).map(item => {
        return {
          ...item,
          processText: getProcessTitleText(item)
        }
      })
    },
    columns () {
      const arr = [
        {
          prop: 'processText',
          label: this.$t('log.process')
        },
        {
          prop: 'name',
          label: this.$t('common.operand')
        },
        {
          prop: 'handle',
          label: this.$t('common.operateType')
        },
        {
          prop: 'status',
          label: this.$t('common.status'),
          minWidth: 80
        },
        {
          prop: 'createdAt',
          label: this.$t('common.createdAt'),
          minWidth: 150
        }
      ]

      return arr
    },
    shortcutList () {
      return [
        { label: this.$t('time.lastestDay'), duration: ONE_DAY_AS_MS },
        { label: this.$t('time.lastestThreeDays'), duration: ONE_DAY_AS_MS * 3 },
        { label: this.$t('time.lastestSevenDays'), duration: ONE_DAY_AS_MS * 7 }
      ]
    }
  },
  components: {
    PageHeader,
    PagerBar,
    EmptyHolder,
    DateTimePickeShort,
    FilterBox
  },
  methods: {
    resetFilter () {
      this.filter = FILTER_INITAL_FORM()
      this.fetchDebounce()
    },
    getList () {
      const self = this
      const { pagination, filter } = this

      const { timeRange, status, ...rest } = filter
      const data = {
        ...rest,
        ...pagination,
        status: status.join(',')
      }

      if (timeRange && timeRange[0] && timeRange[1]) {
        data.startTime = timeRange[0]
        data.endTime = timeRange[1]
      }

      const resource = 'GET_PROCESSES'
      new Ajax({
        resource,
        data,
        success (rsp = {}) {
          const d = rsp.data || {}
          self.pagination = d.pagination || {}
          self.data = d.list || []
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    },
    fetchDebounce: debounce(function () {
      this.pagination = PAGINATION()
      this.getList()
    }, 200)
  },
  mounted () {
    const query = this.$route.query

    this.filter = { ...this.filter, ...query }
  },
  watch: {
    lang () {
      this.fetchDebounce()
    },
    filter: {
      deep: true,
      handler () {
        this.fetchDebounce()
      }
    }
  }
}
</script>

<template lang="pug">
.log
  PageHeader(
    :data="breadcrumb",
    tip="OPERATION_LOG"
  )
    el-button(@click="fetchDebounce")
      i.mr-0.remix.ri-refresh-line
  FilterBox(
    :data="filter",
    @submit="fetchDebounce",
    @reset="resetFilter"
  )
    DateTimePickeShort(
      v-model="filter.timeRange",
      :shortcutList="shortcutList"
    )
  el-table.border-0(v-loading="processing", :data="list", border)
    el-table-column(
      v-for="({ prop, label, minWidth }) in columns",
      :key="prop",
      :prop="prop",
      :label="label"
      :minWidth="minWidth"
    )
      template(slot-scope="scope")
        router-link(
          v-if="prop === 'processText'",
          :to="{ name: 'process', query: { id: scope.row.pid } }"
        ) {{ scope.row.processText }}
        span(v-else-if="prop === 'handle'") {{ $te(`process.handle.${scope.row.handle}`) ? $t(`process.handle.${scope.row.handle}`) : scope.row.handle }}
        span(v-else-if="prop === 'status'") {{ scope.row.status | processStatus }}
        span(v-else-if="prop === 'createdAt'") {{ scope.row.createdAt | timeformat }}
        span(v-else) {{ scope.row[prop] | holder('-') }}
    template(slot="empty")
      EmptyHolder
  PagerBar(
    :data="pagination",
    @refresh="getList",
    :isMountedFetch="false"
  )
</template>

<style lang="scss">
@import '~@/root.scss';

.log > .card {
  border: 1px solid $line;
  border-color: $line !important;
}

</style>
