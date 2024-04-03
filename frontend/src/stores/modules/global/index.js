import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { getUserAPI } from '@/api/user'
import * as ENV from '@/env'

export const useGlobalStore = defineStore('global', () => {
  // state
  const currentUser = ref(null)
  const layoutCollapse = ref(false)

  // getters
  const isAdmin = computed(() => currentUser.value?.isAdmin)

  // actions
  const setCurrentUser = async () => {
    const rsp = await getUserAPI()
    currentUser.value = rsp?.data || {}
  }

  const toggleLayoutCollapse = (val) => {
    layoutCollapse.value = val
  }

  return {
    // state
    currentUser,
    layoutCollapse,

    // getters
    isAdmin,

    // actions
    setCurrentUser,
    toggleLayoutCollapse
  }
})
