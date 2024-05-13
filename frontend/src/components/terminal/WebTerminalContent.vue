<script setup>
import { ref, computed } from 'vue'
import { get } from 'lodash'

import { useTerminalStore } from '@/stores/modules/terminal'

import WebTerminalButton from '@/components/terminal/WebTerminalButton.vue'

const terminalStore = useTerminalStore()

const refreshFlag = ref(0)
const hiddenIframe = ref(false)

const terminalUrl = computed(() => {
  return get(terminalStore.getTerminalProperty, 'terminalUrl')
})

const terminalData = computed(() => {
  return get(terminalStore.getTerminalProperty, 'terminalData', {})
})

const closeTerminal = () => {
  terminalStore.setTerminalProperty('showTerminal',  false)
  terminalStore.setTerminalProperty('terminalUrl',  '')
}

const openNewTab = () => {
  window.open(terminalUrl.value, '_blank')
}

const refresh = () => {
  refreshFlag.value = Date.now()
}

const handleHiddenIframe = () => {
  hiddenIframe.value = !hiddenIframe.value
  terminalStore.setTerminalProperty('hiddenIframe', hiddenIframe.value)
}
</script>

<template lang="pug">
.web-terminal-content
  .terminal-header.flex.items-center.justify-between.px-2
    .flex.items-center
      i.ri-terminal-box-line.mr-2
      span {{ $t('applications.webTerminal') }}
      span(v-if="terminalData.containerName") -{{ terminalData.containerName }}
    .flex.items-center
      WebTerminalButton(:onlyRefresh="true", :data="terminalData", @click="refresh")
      el-button(link, @click="closeTerminal")
        i.ri-close-line.text-white
      el-button(link, @click="handleHiddenIframe")
        i.text-white(:class="hiddenIframe ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'")
      el-button(link, @click="openNewTab")
        i.ri-external-link-line.text-white
  iframe.w-full.h-full(
    v-if="terminalUrl",
    :key="`${refreshFlag}${terminalUrl}`",
    :frameBorder="0",
    :src="terminalUrl",
    sandbox="allow-scripts allow-forms allow-downloads"
  )
</template>

<style lang="scss">
.web-terminal-content {
  border-top: 1px solid #dbdde9;
  background: #fff;
  .terminal-header {
    height: 45px;
    color: #fff;
    background: #000;
  }
}
</style>