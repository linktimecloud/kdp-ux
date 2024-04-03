<script>
import { formatPercentage } from '@/utils/utils'
import { formatCapacityValue } from '@/utils/cluster/utils'

export default {
  name: 'resource-column',
  props: {
    type: {
      type: String,
      default: 'cpu'
    },
    row: {
      type: Object,
      required: true
    },
    isShowUseRate: {
      type: Boolean,
      default: false
    },
    isShowUseRow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isNotRunning () {
      return this.row.status === 'notRunning'
    },
    capacityValItems () {
      const { type, row, isShowUseRate, isShowUseRow, isNotRunning } = this
      const map = {
        cpu: ['cpuUsed', 'cpuRequest', 'cpuLimit'],
        memory: ['memUsed', 'memRequest', 'memLimit']
      }
      let list = map[type] || []

      if (!isShowUseRow) {
        list = list.filter(key => !key.includes('Use'))
      }

      const ret = list.map(key => {
        return {
          value: formatCapacityValue(type, row[key], row.status),
          proportion: key.includes('Use') && !isShowUseRate
            ? ''
            : isNotRunning
              ? 0
              : formatPercentage(row[`${key}Rate`])
        }
      })
      return ret
    }
  }
}
</script>

<template lang="pug">
.resource-column
  .d-flex.justify-content-between(
    v-for="({ value, proportion}, idx) in capacityValItems",
    :key="idx"
  )
    span {{ value }}
    span {{ proportion }}
</template>
