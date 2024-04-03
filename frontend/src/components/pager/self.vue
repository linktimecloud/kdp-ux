<script>
import PagerCore from './core'

export default {
  name: 'pager-self-driven',
  props: {
    data: {
      type: Object,
      required: true
    },
    cls: {
      type: [String, Array, Object],
      required: true
    },
    sizes: {
      type: Array,
      required: true
    },
    layout: {
      type: String,
      required: true
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
    p: {
      get () {
        return this.data[this.offsetField] / this.data.limit + 1
      },
      set (val) {
        this.data[this.offsetField] = (val - 1) * this.data.limit || 0
      }
    }
  },
  components: {
    PagerCore
  },
  methods: {
    handleChange (p) {
      this.p = 1 * p || 1
    },
    handleSizeChange (size) {
      this.data[this.offsetField] = 0
      this.data.limit = size
      if (this.p !== 1) {
        this.handleChange(1)
      } else {
        this.$emit('refresh')
      }
    },
    go (p) {
      const data = this.data || {}
      data[this.offsetField] = data.limit * (p - 1)
      this.$emit('refresh')
    }
  },
  mounted () {
    if (this.isMountedFetch) {
      this.go(this.p)
    }
  },
  watch: {
    p (p) {
      p && this.go(p)
    }
  }
}
</script>

<template lang="pug">
PagerCore(
  :cls="cls",
  :p="p",
  :sizes="sizes",
  :data="data",
  :layout="layout",
  :offsetField="offsetField",
  @handleChange="handleChange",
  @handleSizeChange="handleSizeChange"
)
</template>
