<script setup>
import { ref, computed, onMounted } from 'vue'
import useECharts from '@/composables/useECharts.js'
import { formatChartOption } from './constant'
import { getTimeseriseLineSeriesData } from '@/common/dashboard/utils.js'

const props = defineProps({
  processing: {
    type: Boolean,
    default: false
  },
  dataResults: {
    type: Array,
    required: true
  },
  rawConfig: Object
})

const chartHolderRef = ref(null)

const options = computed(() => {
  const { dataResults, rawConfig } = props
  return {
    ...formatChartOption({ dataResults, rawConfig }),
    series: getTimeseriseLineSeriesData(dataResults)
  }
})

useECharts(chartHolderRef, options)

</script>

<template lang="pug">
.chart-timeserise-line.h-full(v-loading="processing")
  .chart-holder.h-full.w-full(
    ref="chartHolderRef"
  )
  .empty-holder-text.pt-4
    img(src="/img/empty_data.svg")
    p {{ $t('common.noData') }}
</template>

<style lang="scss">
.timeserise-line-tooltip-content {
  max-height: 150px;
  overflow: auto;
  .tooltip-item {
    justify-content: space-between;
  }
}
</style>
