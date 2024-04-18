<script>
/**
 * vue-json-schema-form组件中number类型，使用的是 el-input-number 仅在失去焦点的时候才会set value，导致实时的校验会有问题
 * 为解决上述场景，这里使用 el-input type:number 来进行覆盖解决
 */

import { isNumber } from 'lodash'

export default {
  name: 'SchemaFormNumberInput',
  props: {
    value: [Number],
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: Number,
    max: Number
  },
  data () {
    return {
      showValue: null
    }
  },
  watch: {
    showValue (val) {
      const newVal = (isNumber(val)) ? val : undefined

      this.$emit('input', newVal)
    },
    value (val) {
      this.showValue = val
    }
  },
  mounted () {
    this.showValue = this.value
  }
}
</script>

<template lang="pug">
el-input.schema-form-number-input(
  v-model.number="showValue",
  :disabled="disabled",
  :readonly="readonly",
  :min="min",
  :max="max",
  type="number"
)
</template>
