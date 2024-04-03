<script>
import { get, round } from 'lodash'

import CommonTips from '@/common/TipsIcon.vue'

import { formatDurationTime, getPercentage } from '@/utils/utils'
import { OVERRIDE_DASHBOARD_COLOR } from '../constant'

export default {
  name: 'chart-stat',
  props: {
    dataResults: {
      type: Array,
      required: true
    },
    rawConfig: Object
  },
  computed: {
    results () {
      return this.dataResults.reduce((ret, cur) => {
        const list = (cur.result || []).map(item => ({
          ...item,
          target: cur.target
        }))
        ret.push(...list)
        return ret
      }, [])
    },
    thresholdSteps () {
      return get(this.rawConfig, 'thresholds.steps') || []
    },
    itemRouteTo () {
      const to = get(this.rawConfig, 'to')
      const { name } = this.$route
      return to && to.name !== name ? to : null
    }
  },
  methods: {
    get,
    getTextStyle (item) {
      const steps = get(item, 'target.thresholds.steps') || this.thresholdSteps
      const color = get(steps.find(s => get(item, 'value[1]') >= s.value), 'color') || get(this.rawConfig, 'color')

      return {
        color: OVERRIDE_DASHBOARD_COLOR[color] || color,
        'font-size': this.rawConfig.fontSize || '32px'
      }
    },
    getLegendText (item) {
      const rege = /\{\{(.+?)\}\}/
      const key = get(rege.exec(item.target.legendFormat), '[1]')

      return get(item, `metric.${key}`) || get(item, 'target.legendFormat')
    },
    getValue (item) {
      const value = get(item, 'value[1]')
      const { format } = this.rawConfig
      if (format === 'duration_time') {
        return formatDurationTime(value)
      }

      if (format === 'percent') {
        const percentage = round(getPercentage(value * 100, 1), 1)
        return percentage ? `${percentage}%` : '0%'
      }

      return value
    },
    getMetricLabel (item) {
      const key = get(item, 'metric.phase') || get(item, 'target.legendFormat')
      return this.$te(`dashboard.${key}`) ? this.$t(`dashboard.${key}`) : key
    },
    getLabelTips (item) {
      const key = get(item, 'target.labelTips')
      return key
    }
  },
  components: {
    CommonTips
  }
}
</script>

<template lang="pug">
.chart-stat.flex
  template(v-if="results.length")
    .stat-text-item.flex-1(
      v-for="(item, idx) in results",
      :key="idx"
    )
      router-link(
        v-if="itemRouteTo",
        :to="itemRouteTo",
        target="_blank"
      )
        .label(v-if="getMetricLabel(item)")
          .metric {{ getMetricLabel(item) }}
          CommonTips.ml-1(:name="getLabelTips(item)")
        .value(:style="getTextStyle(item)") {{ getValue(item) }}
      template(v-else)
        .label(v-if="getMetricLabel(item)")
          .metric {{ getMetricLabel(item) }}
          CommonTips.ml-1(:name="getLabelTips(item)")
        .value(:style="getTextStyle(item)") {{ getValue(item) }}
  .empty-holder-text(v-else) {{ $t('common.noData') }}
</template>
