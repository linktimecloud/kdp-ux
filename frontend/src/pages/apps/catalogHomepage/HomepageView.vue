<script>
import ApplicationHomePage from '@/pages/apps/applications/detail/ApplicationDetail.vue'
import PodHomePage from '@/pages/apps/pods/PodHomepage.vue'
import CatalogHomepage from './CatalogHomepage.vue'

export default {
  name: 'applications',
  computed: {
    current () {
      const { application, pod } = this.$route.query
      if (application) {
        if (pod) {
          return PodHomePage
        }
        return ApplicationHomePage
      } else {
        return CatalogHomepage
      }
    }
  }
}
</script>

<template lang="pug">
.application
  component(
    :is="current"
  )
</template>
