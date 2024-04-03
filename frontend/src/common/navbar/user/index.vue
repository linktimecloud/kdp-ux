<script>
import { mapGetters } from 'vuex'

export default {
  name: 'navbar-profile',
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  }
}
</script>

<template lang="pug">
li.nav-item
  a.nav-link
    i.fas.fa-user
    span {{ currentUser.name }}
</template>
