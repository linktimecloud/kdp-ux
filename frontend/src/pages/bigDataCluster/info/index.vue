<script setup>
import { computed } from 'vue'

import Detail from './detail/index.vue'

const current = computed(() => {
  return Detail
})
</script>

<template lang="pug">
.bigDataClusterInfo
  component(
    :breadcrumb="{ content: $t('menu.bigDataCluster') }",
    :is="current"
  )
</template>
