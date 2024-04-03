<script setup>
import BrandIcon from './BrandIcon.vue'
import UserInfo from './UserInfo.vue'
import Languages from './Languages.vue'
</script>

<template lang="pug">
nav.flex.justify-between.items-center.h-full.px-8
  .navbar-brand
    BrandIcon
  .flex
    Languages
    UserInfo.ml-8
</template>