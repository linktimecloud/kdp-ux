<script setup>
import { computed } from 'vue'
import i18n from '@/i18n'

import SearchBox from '@/common/SearchBox.vue'

defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue', 'submit', 'reset'])

const handleOptions = computed(() => {
  const defaultHandleKeys = ['install', 'update', 'restart', 'stop', 'delete', 'uninstall']
  return defaultHandleKeys.map(key => ({
    value: key,
    label: i18n.te(`process.handle.${key}`) ? i18n.t(`process.handle.${key}`) : key
  }))
})

const properties = computed(() => {
  return [
    {
      name: 'name',
      label: i18n.t('common.operateObject'),
      type: 'input'
    },
    {
      name: 'handle',
      label: i18n.t('common.operateType'),
      type: 'select',
      allowCreate: true,
      options: handleOptions.value,
      tipsContent: i18n.t('common.operateTypeTips'),
      placeholder: i18n.t('common.selectOrInput')
    },
    {
      name: 'status',
      label: i18n.t('common.status'),
      type: 'select',
      clearable: true,
      multiple: true,
      options: [
        { label: i18n.t('common.success'), value: 1 },
        { label: i18n.t('common.failed'), value: 2 },
        { label: i18n.t('common.onGoing'), value: 0 }
      ]
    }
  ]
})
</script>

<template lang="pug">
.filter-wrapper.clearfix.bg-transparent
  SearchBox.resource-search-box(
    :model-value="modelValue",
    :properties="properties",
    :action-btns="[{ value: 'reset', type: 'default' }]",
    :max-row-num="3",
    @update:model-value="data => emits('update:modelValue', data)",
    @search="emits('submit')",
    @reset="emits('reset')"
  )
    template(#searchAfter)
      slot
</template>

<style lang="scss">
.process-select-group-dropdown {
  max-height: 300px;
  overflow-y: auto;
}
</style>
