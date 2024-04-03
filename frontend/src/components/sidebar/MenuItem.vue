<script setup>
defineProps({
  data: Object
})
</script>

<template lang="pug">
el-menu-item(
  :index="data.index"
)
  i.menu-icon(
    v-if="data.icon",
    :class="data.icon"
  )
  span {{ $t(`menu.${data.name}`) }}
</template>
