<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { get, debounce, omit } from 'lodash'
import i18n from '@/i18n'
import { useRoute } from 'vue-router'

import PageHeader from '@/components/header/PageHeader.vue'
import PagerBar from '@/components/pager/PagerBar.vue'
import DateTimePickeShort from '@/common/dateTimePicker/ShortTime.vue'
import FilterBox from './ProcessFilter.vue'

import { getProcessListAPI } from '@/api/process'
import { timeformat } from '@/utils/utils.js'
import { getProcessTitleText } from '../utils'
import { STATUS_MAPPER, PAGINATION, ONE_DAY_AS_MS } from '@/constant'

const pagination = ref(PAGINATION())

const columns = computed(() => {
  return [
    {
      prop: 'processText',
      label: i18n.t('log.process')
    },
    {
      prop: 'name',
      label: i18n.t('common.operand')
    },
    {
      prop: 'handle',
      label: i18n.t('common.operateType')
    },
    {
      prop: 'status',
      label: i18n.t('common.status'),
      minWidth: 80
    },
    {
      prop: 'createdAt',
      label: i18n.t('common.createdAt'),
      minWidth: 150
    }
  ]
})

const shortcutList = computed(() => {
  return [
    { label: i18n.t('time.lastestDay'), duration: ONE_DAY_AS_MS },
    { label: i18n.t('time.lastestThreeDays'), duration: ONE_DAY_AS_MS * 3 },
    { label: i18n.t('time.lastestSevenDays'), duration: ONE_DAY_AS_MS * 7 }
  ]
})

const list = ref([])

const processing = ref(false)

const getProcessList = async () => {
  const { timeRange, status, ...rest } = filter.value

  const params = {
    ...rest,
    ...pagination.value,
    status: status.join(',')
  }

  if (timeRange && timeRange[0] && timeRange[1]) {
    params.startTime = timeRange[0]
    params.endTime = timeRange[1]
  }

  processing.value = true
  const rsp = await getProcessListAPI(params)
  list.value = get(rsp, 'data.list', []).map(item => {
    return {
      ...item,
      processText: getProcessTitleText(item)
    }
  })
  pagination.value.total = get(rsp, 'data.pagination.total') || 0
  processing.value = false
}

const FILTER_INITAL_FORM = () => ({
  name: '',
  status: [],
  handle: '',
  timeRange: []
})

const filter = ref(FILTER_INITAL_FORM())

const fetchDebounce = debounce(function () {
  pagination.value = PAGINATION()
  getProcessList()
}, 200)

const resetFilter = () => {
  filter.value = FILTER_INITAL_FORM()
  fetchDebounce()
}

watch(() => ({ ...filter.value }), (val, old) => {
  if (JSON.stringify(val) !== JSON.stringify(old)) {
    fetchDebounce()
  }
}, { deep: true })

const query = get(useRoute(), 'query')

onMounted(() => {
  getProcessList()
  filter.value = { ...filter.value, ...omit(query, 'p') }
})
</script>

<template lang="pug">
.process-log
  PageHeader(:data="{ content: $t('menu.process') }", tip="OPERATION_LOG")
    el-button(@click="fetchDebounce")
      i.mr-0.remix.ri-refresh-line
  FilterBox(
    v-model="filter",
    @submit="fetchDebounce",
    @reset="resetFilter"
  )
    DateTimePickeShort(
      v-model="filter.timeRange",
      :shortcut-list="shortcutList"
    )
  el-table.border-none(v-loading="processing", :data="list", border)
    el-table-column(
      v-for="({ prop, label, minWidth }) in columns",
      :key="prop",
      :prop="prop",
      :label="label",
      :min-width="minWidth"
    )
      template(#default="scope")
        router-link(
          v-if="prop === 'processText'",
          :to="{ name: 'process', query: { id: scope.row.pid } }"
        ) {{ scope.row.processText }}
        span(v-else-if="prop === 'handle'") {{ $te(`process.handle.${scope.row.handle}`) ? $t(`process.handle.${scope.row.handle}`) : scope.row.handle }}
        span(v-else-if="prop === 'status'") {{ scope.row.status ? $t(`common.${STATUS_MAPPER()[scope.row.status]}`) : '' }}
        span(v-else-if="prop === 'createdAt'") {{ timeformat(scope.row.createdAt) }}
        span(v-else) {{ scope.row[prop] }}
  PagerBar(
    :data="pagination",
    :is-mounted-fetch="false",
    @update:data="pagination = $event",
    @refresh="getProcessList"
  )
</template>
