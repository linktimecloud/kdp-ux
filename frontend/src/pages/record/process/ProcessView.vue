<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { get } from 'lodash'

import List from './list/ProcessList.vue'
import Detail from './ProcessHomepage.vue'

const route = useRoute()

const id = computed(() => {
  return get(route, 'query.id')
})

const current = computed(() => {
  return id.value ? Detail : List
})
</script>

<template lang="pug">
component(:is="current")
</template>
