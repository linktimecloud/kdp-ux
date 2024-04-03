<script setup>
const props = defineProps({
  tip: String,
  reason: String,
  btnOptions: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['click'])

const handleClick = () => {
  emits('click')
}
</script>

<template lang="pug">
el-tooltip(
  :disabled="(!reason && !tip)",
  :content="reason || tip"
)
  template(#content)
    .text-xs
      i.ri-error-warning-line.mr-2(v-if="!!reason")
      span {{ reason || tip }}
  span.flex.items-center
    el-button(
      :type="btnOptions.type || 'primary'",
      v-bind="btnOptions",
      :disabled="!!reason",
      @click.prevent="handleClick"
    )
      slot
  </template>
