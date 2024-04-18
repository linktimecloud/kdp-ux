<script>
export default {
  name: 'SchemaFormSecretInput',
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
  watch: {
    showValue (val) {
      let newVal = val
      if (this.isVisible) {
        try {
          newVal = btoa(val)
        } catch (e) {
          console.log(e)
        }
      }
      this.$emit('input', newVal)
    }
  },
  mounted () {
    this.showValue = this.value
  },
  methods: {
    changeVisible (curIsVisible) {
      if (this.isVisible === curIsVisible) return
      this.isVisible = curIsVisible
      if (curIsVisible) {
        // decode base 64
        try {
          this.showValue = atob(this.showValue)
        } catch (e) {
          console.log(e)
        }
      } else {
        // encode base 64
        try {
          this.showValue = btoa(this.showValue)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}
</script>

<template lang="pug">
el-input.schema-form-secret-input(
  v-model.trim="showValue",
  :disabled="disabled",
  :readonly="readonly",
  @focus="changeVisible(true)"
)
  template(#suffix)
    i.cursor-pointer(
      v-if="!readonly && !disabled",
      :class="isVisible ? 'ri-eye-line' : 'ri-eye-off-line'",
      @click="changeVisible(!isVisible)"
    )
</template>
