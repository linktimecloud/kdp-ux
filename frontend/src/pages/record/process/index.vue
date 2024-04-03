<script>
/**
 * import content
 */
import List from './list'
import Detail from './detail'

export default {
  name: 'process',
  computed: {
    id () {
      return this.$route.query.id
    },
    current () {
      return this.id ? Detail : List
    }
  },
  mounted () {
    this.$store.dispatch('setLayoutType', 'panel')
  }
}
</script>

<template lang="pug">
component(:is="current")
</template>
