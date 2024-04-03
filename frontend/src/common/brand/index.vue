<script>
import { mapGetters } from 'vuex'

export default {
  name: 'brand-icon',
  computed: {
    ...mapGetters([
      'entry',
      'customizeEnv',
      'layoutType',
      'layoutCollapse',
      'isReadyCustomize'
    ]),
    src () {
      const { icon } = this.customizeEnv
      return icon || '/static/img/logo.png'
    }
  }
}
</script>

<template lang="pug">
.brand(v-if="isReadyCustomize")
  router-link.logo(:to="entry")
    img(
      :src="src",
      :title="customizeEnv.title",
      :alt="customizeEnv.title"
    )
</template>

<style lang="scss">
.brand {
  .logo {
    display: inline-block;
    max-width: 160px;
    img {
      max-height: 42px;
      max-width: 100%;
    }
  }
}
</style>
