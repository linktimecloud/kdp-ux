<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { get } from 'lodash'

import List from './list/index.vue'
import Detail from './detail/index.vue'

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
