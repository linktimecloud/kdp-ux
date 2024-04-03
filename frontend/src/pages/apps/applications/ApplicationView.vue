<script>
import List from './list'
import Detail from './detail'

export default {
  name: 'applications',
  computed: {
    breadcrumb () {
      return {
        text: 'menu.applications',
        name: 'applications'
      }
    },
    current () {
      const { name, group } = this.$route.query
      return (name && group) ? Detail : List
    }
  }
}
</script>

<template lang="pug">
.application
  component(
    :breadcrumb="breadcrumb",
    :is="current",
    resourceType="bdc"
  )
</template>
