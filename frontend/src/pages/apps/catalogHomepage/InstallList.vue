<script setup>
import { computed } from 'vue'

import AppList from '@/pages/apps/applications/list/ApplicationList.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  refreshFlag: Number
})

const propsFilter = computed(() => {
  const { name } = props
  const { query: { sub } } = route
  return {
    catalog: name,
    form: sub
  }
})
</script>

<template lang="pug">
.catalog-install-list.shadow-box
  AppList.content(
    :props-filter="propsFilter",
    :options="{ hiddenSearch: true, hiddenColumns: ['catalog'] }",
    :refresh-flag="refreshFlag"
  )
</template>
