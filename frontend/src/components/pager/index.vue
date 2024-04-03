<script>
import RouterDriven from './router'
import SelfDriven from './self'

export default {
  name: 'pager',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    cls: {
      type: [String, Array, Object],
      default: ''
    },
    sizes: {
      type: Array,
      default: () => ([10, 20, 50, 100])
    },
    enableLimitSelector: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'router'
    },
    offsetField: {
      type: String,
      default: 'start'
    },
    isMountedFetch: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    layout () {
      const arr = ['total', 'prev', 'pager', 'next']
      if (this.enableLimitSelector) {
        arr.push('sizes')
      }
      return arr.join(',')
    },
    show () {
      const data = this.data || {}
      const multiPage = data.total >= data.limit
      const correctStart = data[this.offsetField] === data.total || data[this.offsetField] < data.total
      const correctPage = multiPage && correctStart
      const totalMoreThanMinSize = data.total > this.sizes[0]
      return this.enableLimitSelector ? totalMoreThanMinSize : correctPage
    },
    current () {
      const type = this.type
      let ret
      if (type === 'router') {
        ret = RouterDriven
      } else {
        ret = SelfDriven
      }
      return ret
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>

<template lang="pug">
.pager.text-center.py-3.bg-white(
  v-show="show",
  v-if="data"
)
  components(
    v-show="data.total",
    :is="current",
    :cls="cls",
    :sizes="sizes",
    :data="data",
    :layout="layout",
    :offsetField="offsetField",
    :isMountedFetch="isMountedFetch"
    @refresh="refresh"
  )
</template>
