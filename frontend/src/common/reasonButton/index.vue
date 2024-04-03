<script>
import { isPlainObject } from 'lodash'

export default {
  name: 'reason-button',
  props: {
    tip: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    type: {
      type: String,
      default: 'primary'
    },
    cls: {
      type: [String, Array, Object],
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    finalClass () {
      const { cls, reason } = this
      const classes = cls || ''
      if (!reason) {
        return classes
      }

      let result = classes
      if (Array.isArray(classes)) {
        result.push('disabled')
      } else if (isPlainObject(classes)) {
        result.disabled = true
      } else {
        result += ' disabled'
      }
      return result
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<template lang="pug">
el-tooltip(
  :disabled="(!reason && !tip)",
  :placement="placement",
  :content="reason || tip"
)
    .font-xs(
      slot="content"
    )
      i.fas.fa-exclamation.mr-2(
        v-if="!!reason"
      )
      span {{ reason || tip }}
    span
      el-button(
        :class="finalClass",
        :type="type",
        :size="size",
        @click.prevent="handleClick",
        :disabled="!!reason",
        v-loading="loading"
      )
        slot
</template>
