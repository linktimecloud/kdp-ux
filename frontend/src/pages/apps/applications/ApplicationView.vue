<script>
import List from './list'
import Detail from './detail'

export default {
  name: 'ApplicationView',
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
    :is="current",
    :breadcrumb="breadcrumb",
    resource-type="bdc"
  )
</template>
