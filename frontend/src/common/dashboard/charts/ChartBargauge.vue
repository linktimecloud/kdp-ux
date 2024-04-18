<script>
import { get, toNumber } from 'lodash'
import { OVERRIDE_DASHBOARD_COLOR } from '../constant'

export default {
  name: 'ChartBargauge',
  props: {
    dataResults: {
      type: Array,
      required: true
    },
    rawConfig: Object
  },
  data () {
    return {
      OVERRIDE_DASHBOARD_COLOR
    }
  },
  computed: {
    valueList () {
      return (this.dataResults || [])
        .reduce((list, cur) => {
          const newList = (cur.result || []).map(item => ({
            ...item.metric,
            value: this.formatValue(item.value[1]),
            label: this.getI18nLabel(cur?.target?.legendFormat, item.metric),
            color: this.getBoxColor(item)
          }))
          list.push(...newList)
          return list
        }, [])
        .filter(item => !isNaN(item.value))
    },
    strokeWidth () {
      return this.rawConfig.strokeWidth || 8
    }
  },
  methods: {
    getLinkTo (item) {
      const { name, query } = this.rawConfig.to

      const rege = /\{\{(.+?)\}\}/

      const q = Object.keys(query).reduce((ret, key) => {
        const variable = get(rege.exec(query[key]), '[1]')
        ret[key] = item[variable] || query[key]
        return ret
      }, {})

      return {
        name,
        query: q
      }
    },
    getI18nLabel (key, data) {
      const { $te, $t } = this
      return $te(`dashboard.${key}`) ? $t(`dashboard.${key}`, data) : key
    },
    formatValue (value) {
      if (toNumber(value)) {
        const reg = toNumber(value) > 1 ? /^[0-9]*.[0-9]{2}/ : /^[0-9]*.(0)*[0-9]{2}/
        return toNumber(get(value.toString().match(reg), '[0]') || value)
      }

      return value
    },
    getBoxColor (item) {
      const steps = get(item, 'target.thresholds.steps') || get(this.rawConfig, 'thresholds.steps') || []
      const color = get(steps.find(s => get(item, 'value[1]') > s.value), 'color')

      return OVERRIDE_DASHBOARD_COLOR[color] || OVERRIDE_DASHBOARD_COLOR.green
    }
  }
}
</script>

<template lang="pug">
.chart-bargauge.h-full
  template(v-if="valueList.length")
    .bar-item.flex(
      v-for="item in valueList",
      :key="item.label"
    )
      router-link(
        v-if="rawConfig.to",
        :to="getLinkTo(item)",
        target="_blank"
      )
        el-tooltip(:content="getI18nLabel(rawConfig.tips)")
          .label.ml-2 {{ item.label }}
      .label.ml-2(v-else) {{ item.label  }}
      el-progress.flex-1.mx-2(
        :percentage="Math.min(item.value, 100)",
        :stroke-width="strokeWidth",
        :format="() => ('')",
        :color="item.color"
      )
      .value-text.text-high {{ item.value }} {{ getI18nLabel(rawConfig.unit) }}
  .empty-holder-text.mt-4(v-else)
    img(src="/img/empty_data.svg")
    p.m-0 {{ $t('common.noData') }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.chart-bargauge {
  overflow-y: auto;
  .bar-item {
    line-height: 20px;
    height: 20px;
    font-size: 12px;
    .label {
      min-width: 50px;
      color: $font;
      text-align: right;
    }
    a .label:hover {
      color: $primary_color;
    }
    .el-progress {
      line-height: 16px;
    }
    .el-progress-bar {
      padding-right: 0;
      margin-right: 0;
    }
    .value-text {
      width: 50px;
      font-weight: 600;
    }
  }
}
</style>
