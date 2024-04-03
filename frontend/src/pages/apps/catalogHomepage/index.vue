<script>
import ApplicationHomePage from '@/pages/apps/applications/detail'
import PodHomePage from '@/pages/apps/pods/homePage'
import CatalogHomepage from './homepage'

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
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')
  }
}
</script>

<template lang="pug">
.application
  component(
    :is="current"
  )
</template>
