<script>
import SearchBox from '@/common/searchBox'

export default {
  name: 'process-list-filter',
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    handleOptions () {
      const defaultHandleKeys = ['install', 'update', 'restart', 'stop', 'delete', 'uninstall']
      return defaultHandleKeys.map(key => ({
        value: key,
        label: this.$te(`process.handle.${key}`) ? this.$t(`process.handle.${key}`) : key
      }))
    },
    properties () {
      const { handleOptions } = this
      const ret = [
        {
          name: 'name',
          label: this.$t('common.operateObject'),
          type: 'input'
        },
        {
          name: 'handle',
          label: this.$t('common.operateType'),
          type: 'select',
          allowCreate: true,
          options: handleOptions,
          tipsContent: this.$t('common.operateTypeTips'),
          placeholder: this.$t('common.selectOrInput')
        },
        {
          name: 'status',
          label: this.$t('common.status'),
          type: 'select',
          clearable: true,
          multiple: true,
          options: [
            { label: this.$t('common.success'), value: 1 },
            { label: this.$t('common.failed'), value: 2 },
            { label: this.$t('common.onGoing'), value: 0 }
          ]
        }
      ]
      return ret
    }
  },
  components: {
    SearchBox
  },
  methods: {
    getHandleSuggestions (queryString, cb) {
      cb(this.handleOptions)
    }
  }
}
</script>

<template lang="pug">
.filter-wrapper.clearfix.bg-transparent
  SearchBox.resource-search-box(
    :data="data",
    :properties="properties",
    :actionBtns="[{ value: 'reset', label: $t('common.reset'), type: 'default' }]",
    @search="$emit('submit')",
    @reset="$emit('reset')"
  )
    template(slot="searchAfter")
      slot
</template>

<style lang="scss">
.process-select-group-dropdown {
  max-height: 300px;
  overflow-y: auto;
}
</style>
