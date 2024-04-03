<script setup >
import { computed } from 'vue'

import { useGlobalStore } from '@/stores/modules/global'

const globalStore = useGlobalStore()

const currentUser = computed(() => globalStore.currentUser || {})

</script>

<template lang="pug">
.nav-item.text-white
  i.ri-user-line.mr-2
  span {{ currentUser.name }}
</template>
