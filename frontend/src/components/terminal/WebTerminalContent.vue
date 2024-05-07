<script setup>
import { computed } from 'vue'

import { useTerminalStore } from '@/stores/modules/terminal'

const terminalStore = useTerminalStore()

const terminalUrl = computed(() => {
  return terminalStore.getTerminalUrl
})

const closeTerminal = () => {
  terminalStore.setTerminalUrl('')
}
</script>

<template lang="pug">
.web-terminal-content
  el-button.close-button(link, @click="closeTerminal")
    i.ri-close-circle-fill.text-white
  iframe.w-full.h-full.px-1.py-1(
    v-if="terminalUrl",
    :frameBorder="0",
    :src="terminalUrl",
    sandbox="allow-scripts allow-forms allow-downloads"
  )
</template>

<style lang="scss">
.web-terminal-content {
  border-top: 1px solid #dbdde9;
  background: #fff;
  position: relative;
  .close-button {
    position: absolute;
    top: 6px;
    right: 10px;
  }
}
</style>