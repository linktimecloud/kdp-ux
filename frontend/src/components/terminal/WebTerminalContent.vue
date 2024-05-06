<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

import { useTerminalStore } from '@/stores/modules/terminal'

const terminalStore = useTerminalStore()

const showIframe = ref(false)
const isLoading = ref(true)

const terminalUrl = computed(() => {
  return terminalStore.getTerminalUrl
})

const closeTerminal = () => {
  terminalStore.setTerminalUrl('')
}

const WAIT_REFRESH = 10000
let handler
const MAX_RETRY_NUM = 3
const retryNum = ref(0)
const stop = () => {
  clearInterval(handler)
}
const restart = () => {
  showIframe.value = false
  stop()
  checkUrl()
  handler = setInterval(checkUrl, WAIT_REFRESH)
}
const checkUrl = async () => {
  isLoading.value = true
  return await axios.get(terminalUrl.value).then(response => {
    console.log('Response status: ', response.status)
    if (response.status === 200) {
      stop()
      showIframe.value = true
    }
  }).catch(error => {
    console.log('Error: ', error)
    if (retryNum.value >= MAX_RETRY_NUM) {
      stop()
    }
    retryNum.value++
  }).finally(() => {
    isLoading.value = false
  })
}

watch(() => terminalUrl.value, (newVal, oldVal) => {
  console.log('watch===', newVal, oldVal)
  if (newVal && newVal !== oldVal) {
    restart()
  }
  if (!newVal) {
    stop()
  }
}, { immediate: true })
</script>

<template lang="pug">
.web-terminal-content.shadow-FilterBox(:loading="isLoading")
  template(v-if="showIframe")
    el-button.close-button(link, @click="closeTerminal")
      i.ri-close-circle-fill.text-white
    iframe.w-full.h-full.px-1.py-1(
      ref="iframe",
      :frameBorder="0",
      :src="terminalUrl",
      sandbox="allow-scripts allow-forms allow-downloads"
    )
  EmptyHolder(v-else, :full="false", :height="300")
    p {{ $t('applications.refreshTerminalTip' )}}
</template>

<style lang="scss">
.web-terminal-content {
  background: #fff;
  position: relative;
  .close-button {
    position: absolute;
    top: 6px;
    right: 10px;
  }
}
</style>