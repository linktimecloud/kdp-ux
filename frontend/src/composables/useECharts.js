import { onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { debounce } from 'lodash'
import * as ECharts from 'echarts'

const DEFAULT_OPTION = {
  resize: true,
  animation: false,
  addDataAnimation: false,
  theme: 'macarons',
  isInit: true
}

export default function useECharts(domRef, initOptions) {
  let chart = null
  const options = computed(() => {
    return {
      ...DEFAULT_OPTION,
      ...initOptions?.value
    }
  })

  const initChart = () => {
    const el = domRef.value
    if (el) {
      chart = ECharts.init(el, options.value.theme)

      chart.on('click', params => {
        el.value.$emit('click', params)
      })
    }
  }

  const updateOption = (dataOption) => {
    if (chart) {
      chart.clear()
      chart.setOption(dataOption)
    }
  }

  const resizeHandler = debounce(() => chart.resize(), 100)

  onMounted(() => {
    if (options.value.resize) {
      window.addEventListener('resize', resizeHandler, { passive: true })
    }
    if (options.value.isInit) {
      initChart()
    }
  })

  onBeforeUnmount(() => {
    if (options.value.resize) {
      window.removeEventListener('resize', resizeHandler)
    }
    if (chart) {
      chart.dispose()
    }
  })

  watch(() => options.value, (val) => {
    updateOption(val)
  })

  watch(() => domRef.value, (val) => {
    val && options.value.isInit && initChart()
  })

  return { initChart, updateOption }
}