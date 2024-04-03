/**
 * Import utils modules
 */
import { debounce } from 'lodash'

/**
 * Import framework modules
 */
import { mapGetters } from 'vuex'

/**
 * import echarts
 */
import * as ECharts from 'echarts/core'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/theme/macarons'

/**
 * This is a chart mixin
 * You can use mixinConfig to enable/disable its features
 * resize: repaint chart when window resized, default true
 * manual: repaint chart when manual toggle off/on, default true
 * theme: chart theme, default macarons
 */

const DEFAULT_OPTION = {
  resize: true,
  animation: false,
  addDataAnimation: false
}

export default {
  name: 'chart-mixin',
  data () {
    return {
      chart: null,
      mixinConfig: {
        resize: true,
        manual: true,
        theme: 'macarons'
      },
      resizeHandler: null
    }
  },
  computed: {
    ...mapGetters(['layoutType', 'layoutCollapse']),
    manual () {
      return {
        layoutType: this.layoutType
      }
    }
  },
  methods: {
    initChart () {
      const self = this
      const el = this.$el
      const { mixinConfig } = this
      this.chart = ECharts.init(el, mixinConfig.theme)

      this.chart.on('click', params => {
        self.$emit('click', params)
      })

      this.updateOption(this.option)
    },
    resize (opt = {}) {
      const { chart } = this
      chart && chart.resize(opt)
    },
    repaint () {
      const { chart } = this
      chart && chart.repaint()
    },
    updateOption (data = {}) {
      const { chart } = this
      if (chart) {
        chart.clear()
        chart.setOption({
          ...data,
          ...DEFAULT_OPTION
        }, {
          notMerge: true
        })
      }
    },
    toggleLegend (name) {
      this.chart.dispatchAction({
        type: 'legendToggleSelect',
        name
      })
    }
  },
  watch: {
    option: {
      deep: true,
      handler: function (opt) {
        this.updateOption(opt)
      }
    },
    manual () {
      if (this.mixinConfig.manual) {
        this.resize()
      }
    },
    layoutCollapse () {
      if (this.mixinConfig.resize) {
        setTimeout(this.resize, 0)
      }
    }
  },
  beforeDestroy () {
    const { chart, mixinConfig, resizeHandler } = this
    // Remove resize listener
    if (mixinConfig.resize && resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
    // Dispose chart
    if (chart) {
      chart.dispose()
    }
  },
  mounted () {
    const self = this
    !this.disabledRender && this.initChart()
    // Add resize listener
    if (this.mixinConfig.resize) {
      this.resizeHandler = debounce(self.resize)
      window.addEventListener('resize', self.resizeHandler)
    }
  }
}
