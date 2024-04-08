<script setup>
import { computed } from 'vue'

import ApplicationHomePage from '@/pages/apps/applications/detail/ApplicationDetail.vue'
import PodHomePage from '@/pages/apps/pods/PodHomepage.vue'
import CatalogHomepage from './CatalogHomepage.vue'

import { useRoute } from 'vue-router'
const route = useRoute()

const current = computed(() => {
  const { application, pod } = route.query
  if (application) {
    if (pod) {
      return PodHomePage
    }
    return ApplicationHomePage
  } else {
    return CatalogHomepage
  }
})
</script>

<template lang="pug">
.application
  component(
    :is="current"
  )
</template>
