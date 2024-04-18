<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

import i18n from '@/i18n'

import ProcessList from './LogList.vue'
import SearchBox from '@/common/SearchBox.vue'
import { getProcessTitleText } from '@/pages/record/process/utils'
import { getProcessDetailLogsAPI } from '@/api/process'

import { STATUS_MAPPER } from '@/constant'

const WAIT_REFRESH = 10000
let handler
const MAX_RETRY_NUM = 3

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const loading = ref(false)
const status = ref(0)
const pagination = ref({})
const logData = ref([])
const titleOpt = ref({
  text: '',
  class: '',
  icon: ''
})
const filter = ref({
  keyword: '',
  level: []
})
const retryNum = ref(0)

const properties = computed(() => {
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
})

const list = computed(() => {
  const { keyword, level } = filter.value
  let ret = logData.value
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
})

const resetFilter = () => {
  filter.value.keyword = ''
  filter.value.level = ''
}

const emit = defineEmits(['update:status'])

const getList = async () => {
  const data = {
    ...pagination.value,
    exclude: 'PREDEFINED'
  }
  const pid = props.id
  loading.value = true
  const httpRes = await getProcessDetailLogsAPI({ pid }).then((rsp) => {
    const d = rsp.data
    pagination.value = d.pagination || {}
    logData.value = d.list || []
    status.value = d.status
    emit('update:status', d.status)

    titleOpt.value.text = getProcessTitleText(d)

    switch (status.value) {
      case 1:
        titleOpt.value.icon = 'ri-checkbox-circle-line'
        titleOpt.value.class = 'text-success'
        stop()
        break
      case 2:
        titleOpt.value.icon = 'ri-close-circle-line'
        titleOpt.value.class = 'text-danger'
        stop()
        break
      case 0:
        titleOpt.value.icon = 'ri-loader-2-line spin'
        titleOpt.value.class = 'text-primary'
        break
      default:
        titleOpt.value.icon = 'ri-loader-2-line spin'
        titleOpt.value.class = 'text-primary'
        break
    }
  }).catch((error) => {
    if (retryNum.value >= MAX_RETRY_NUM) {
      stop()
    }
    retryNum.value++
  })
  loading.value = false
}
const stop = () => {
  clearInterval(handler)
}
const restart = () => {
  stop()
  getList()
  handler = setInterval(getList, WAIT_REFRESH)
}
const resetKeyword = () => {
  filter.value.keyword = ''
}
onMounted(() => {
  restart()
})

onBeforeUnmount(() => {
  logData.value = []
  stop()
})

watch(() => props.id, (val) => {
  if (val) {
    restart()
  } else {
    stop()
  }
})
</script>

<template lang="pug">
.process-logs
  .title.mb-2(:class="titleOpt.class")
    i.mr-1(:class="titleOpt.icon")
    span(v-if="titleOpt.text") {{ titleOpt.text }}, {{ i18n.t(`common.${STATUS_MAPPER()[status]}`) }}
    span(v-else) {{ i18n.t('common.loading') }}
  SearchBox.mb-2.p-0.border-0.resource-search-box(
    :data="filter",
    :properties="properties",
    :actionBtns="[{ value: 'reset', label: i18n.t('common.reset'), type: 'default' }]",
    @reset="resetFilter"
  )
  ProcessList(:data="list", :keyword="filter.keyword")
</template>

<style lang="scss">
.process-logs {
  .title {
    font-size: 1.25rem;
  }
}
</style>
