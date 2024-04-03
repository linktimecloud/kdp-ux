<script>
import { round } from 'lodash'

export default {
  name: 'percentage',
  props: {
    total: {
      type: [Number, String],
      default: 1
    },
    value: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    percent () {
      const { value, total } = this
      const ret = value > total ? 1 : ((value / total) || 0)
      return round(ret * 100, 1)
    },
    color () {
      const { percent } = this
      let ret = '#2a62c4'

      if (percent < 30) ret = '#31beae'
      if (percent > 80) ret = '#e6a23b'
      if (percent > 90) ret = '#fa8280'

      return ret
    }
  },
  methods: {
    format (percentage) {
      return percentage === 0 ? '0' : `${percentage}%`
    }
  }
}
</script>

<template lang="pug">
el-progress(
  :percentage="percent",
  :color="color",
  :format="format"
)
</template>
