<script>
import PagerCore from './core'

export default {
  name: 'pager-router-driven',
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
        const r = this.$route
        return r.query.p * 1 || 1
      },
      set (val) {
        const r = this.$route
        const query = { ...r.query }
        query.p = val
        this.$router.push({ query })
      }
    },
    currentOffset () {
      return this.data[this.offsetField]
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
        this.refresh()
      }
    },
    refresh () {
      this.data[this.offsetField] = (this.p - 1) * this.data.limit
      this.$emit('refresh')
    }
  },
  mounted () {
    if (this.isMountedFetch) {
      this.refresh()
    }
  },
  watch: {
    p (val) {
      this.data[this.offsetField] = (val - 1) * this.data.limit
      this.refresh()
    },
    currentOffset (val) {
      if (!val) {
        this.p = 1
      }
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
