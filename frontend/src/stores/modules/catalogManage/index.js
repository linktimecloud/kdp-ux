import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import i18n from '@/i18n'
import { uniqBy, orderBy } from 'lodash'

import { getCatalogsAPI } from '@/api/catalog'

export const useCatalogManageStore = defineStore('catalogManage', () => {
  // state
  const catalogTypesData = ref([])

  // getters
  const catalogTypeList = computed(() => {
    const list = catalogTypesData.value
    let ret = list.map(item => ({
      value: item.category,
      label: item.category,
      description: item.description
    }))
    ret = ret.concat([{ value: 'other', label: i18n.t('common.other') }])
    ret = uniqBy(ret, 'label')
    ret = orderBy(ret, ['label'], ['desc'])
    return ret
  })

  // actions
  const setCatalogTypes = async () => {
    const rsp = await getCatalogsAPI()
    catalogTypesData.value = rsp?.data || []
  }

  return {
    // state
    catalogTypesData,

    // getters
    catalogTypeList,

    // actions
    setCatalogTypes
  }
})
