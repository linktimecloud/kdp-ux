<script>
import Detail from './detail'

export default {
  name: 'bigDataClusterInfo',
  computed: {
    breadcrumb () {
      return {
        text: 'menu.bigDataCluster',
        name: 'bigDataClusterInfo'
      }
    },
    current () {
      return Detail
    }
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')
  }
}
</script>

<template lang="pug">
.bigDataClusterInfo
  component(
    :breadcrumb="breadcrumb",
    :is="current"
  )
</template>
