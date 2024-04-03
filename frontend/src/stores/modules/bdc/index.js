import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getBdcListAPI } from '@/api/bdc'

export const useBdcStore = defineStore('bdc', () => {
  // state
  const currentBdcInfo = ref({})

  // getters
  const currentBdcName = computed(() => currentBdcInfo.value.name)
  const currentBdcNS = computed(() => currentBdcInfo.value.defaultNS)

  // actions
  const setCurrentBdc = async () => {
    const rsp = await getBdcListAPI()
    currentBdcInfo.value = rsp?.data?.[0] || {}
  }

  return {
    // state
    currentBdcInfo,

    // getters
    currentBdcName,
    currentBdcNS,

    // actions
    setCurrentBdc
  }
})
