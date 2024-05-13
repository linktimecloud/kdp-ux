<script setup>
import BrandIcon from './BrandIcon.vue'
import UserInfo from './UserInfo.vue'
import Languages from './LanguagesBox.vue'
import WebTerminalButton from '@/components/terminal/WebTerminalButton.vue'
</script>

<template lang="pug">
nav.flex.justify-between.items-center.h-full.px-8
  .navbar-brand
    BrandIcon
  .flex
    WebTerminalButton
    Languages.ml-8
    UserInfo.ml-8
</template>