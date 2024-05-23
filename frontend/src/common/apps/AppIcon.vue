<script setup>
import { computed } from 'vue'

import { API_BASE } from '@/env'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    default: ''
  },
  cls: {
    type: String,
    default: 'mx-auto'
  }
})

const icon = computed(() => {
  return API_BASE + '/img?type=icon&name=' + props.name.toLowerCase()
})
</script>

<template lang="pug">
img.app-icon.img-fluid.mx-auto.d-block(
  v-if="name",
  :class="cls",
  :src="icon"
)
</template>
