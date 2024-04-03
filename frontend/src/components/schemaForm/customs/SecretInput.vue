<script>
export default {
  name: 'schema-form-secret-input',
  props: {
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isVisible: false,
      showValue: ''
    }
  },
  methods: {
    changeVisible (curIsVisible) {
      if (this.isVisible === curIsVisible) return

      this.isVisible = curIsVisible

      if (curIsVisible) {
        // decode base 64
        try {
          this.showValue = atob(this.showValue)
        } catch (e) {}
      } else {
        // encode base 64
        try {
          this.showValue = btoa(this.showValue)
        } catch (e) {}
      }
    }
  },
  mounted () {
    this.showValue = this.value
  },
  watch: {
    showValue (val) {
      let newVal = val
      if (this.isVisible) {
        try {
          newVal = btoa(val)
        } catch (e) {}
      }

      this.$emit('input', newVal)
    }
  }
}
</script>

<template lang="pug">
el-input.schema-form-secret-input(
  :disabled="disabled",
  :readonly="readonly",
  v-model.trim="showValue",
  @focus="changeVisible(true)"
)
  i.cursor-pointer(
    v-if="!readonly && !disabled",
    slot="suffix",
    :class="isVisible ? 'ri-eye-line' : 'ri-eye-off-line'",
    @click="changeVisible(!isVisible)"
  )
</template>
