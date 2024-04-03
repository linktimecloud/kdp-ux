<script>
import { mapGetters } from 'vuex'

import BrandIcon from '@/common/brand'

import User from './user'
import Languages from './languages'

export default {
  name: 'navbar',
  computed: {
    ...mapGetters([
      'layoutType',
      'layoutCollapse',
      'currentUser',
      'isAdmin',
      'customizeEnv',
      'lang',
      'entry'
    ]),
    current () {
      return this.$route.name
    },
    features () {
      return this.customizeEnv.features || {}
    },
    enableTicket () {
      return this.features.TICKETS && !!this.currentUser
    }
  },
  components: {
    BrandIcon,
    User,
    Languages
  }
}
</script>

<template lang="pug">
nav.navbar.navbar-expand.navbar-dark.fixed-top.pl-4.pr-4
  .navbar-brand
    BrandIcon
  ul.navbar-nav.ml-auto
    Languages(v-if="features.LANG")
    User
</template>

<style lang="scss">
@import '~@/root.scss';
.navbar {
  background-image: linear-gradient(to right, #4353a4 0%, #416aff 100%);
  box-shadow: 0 2px 5px 0 $line;
  justify-content: space-between;
  height: 65px;
  top: 0;
  padding: 0;
  z-index: 2001;
  i {
    margin-right: 10px;
  }

  .nav-item {
    padding: 0 10px;
    line-height: 42px;
    cursor: pointer;
    .nav-link {
      color: $font_white;
      &.active,
      &:active {
        color: rgb(103, 152, 239);
      }
    }
  }

  .navbar-demo & {
    box-shadow: 0 2px 5px 0 #2a62c4;
  }
}
</style>
