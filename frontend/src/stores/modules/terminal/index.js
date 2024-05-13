import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const defaultTerminalProperty = () => ({
  showTerminal: false,
  terminalUrl: '',
  terminalData: {},
  hiddenIframe: false
})

export const useTerminalStore = defineStore('terminal', () => {
  // state
  const terminalProperty = ref({ ...defaultTerminalProperty })

  // getters
  const getTerminalProperty = computed(() => terminalProperty.value)

  // actions
  const setTerminalProperty = (param, val) => {
    terminalProperty.value[param] = val
  }

  const initTerminalProperty = () => {
    terminalProperty.value = { ...defaultTerminalProperty }
  }

  return { getTerminalProperty, setTerminalProperty, initTerminalProperty }
})
