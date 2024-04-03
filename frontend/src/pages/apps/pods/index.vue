<script>
import List from './list'
import Detail from './homePage'

export default {
  name: 'application-pods',
  computed: {
    breadcrumb () {
      return {
        text: 'menu.pods',
        name: 'applications'
      }
    },
    current () {
      const { pod, action } = this.$route.query
      return pod && action === 'detail' ? Detail : List
    }
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')
  }
}
</script>

<template lang="pug">
.application-pods
  component(
    :breadcrumb="breadcrumb",
    :is="current",
    resourceType="bdc"
  )
</template>
