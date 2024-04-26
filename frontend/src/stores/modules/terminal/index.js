import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTerminalStore = defineStore('terminal', () => {
  // state
  const terminalUrl = ref('')

  // getters
  const getTerminalUrl = computed(() => terminalUrl.value)

  // actions
  const setTerminalUrl = (val) => {
    terminalUrl.value = val
  }

  return { getTerminalUrl, setTerminalUrl }
})
