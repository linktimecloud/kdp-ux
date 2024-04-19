<script setup>
import { get } from 'lodash'
import i18n from '@/i18n'
import { getAppListAPI, getAppPodsAPI, getAppPodDetailAPI } from '@/api/applications'
import { DEFAULT_OPTIONS } from '@/constant/application'
import SearchBox from '@/common/SearchBox.vue'
import { ref, watch, computed } from 'vue'
import { useBdcStore } from '@/stores/modules/bdc'

const bdcStore = useBdcStore()

const props = defineProps({
  filter: {
    type: Object,
    required: true
  },
  hiddenItems: {
    type: Array,
    default: () => ([])
  }
})

const emits = defineEmits(['change', 'reset'])

const propertiesOptions = ref({ apps: [], pods: [], containers: [] })

const currentBdcName = computed(() => bdcStore.currentBdcName)
const currentBdcNS = computed(() => bdcStore.currentBdcNS)

const properties = computed(() => {
  const { apps, pods, containers } = propertiesOptions.value
  const ret = [
    { name: 'keyword', label: '', type: 'input', suffixIcon: 'ri-search-line', placeholder: `${i18n.t('common.input')}${i18n.t('dashboard.logContenKeywords')}` },
    { name: 'app', label: i18n.t('applications.instance'), type: 'select', clearable: false, options: apps },
    { name: 'pod', label: i18n.t('applications.appPod'), type: 'select', options: DEFAULT_OPTIONS().concat(pods), clearable: false },
    { name: 'container', label: i18n.t('applications.container'), type: 'select', options: DEFAULT_OPTIONS().concat(containers), clearable: false }
  ]

  return ret.filter(item => !props.hiddenItems.includes(item.name))
})

const handleChange = (data) => {
  emits('change', { ...props.filter, ...data })
}

const getApps = () => {
  if (!currentBdcName.value) return

  return getAppListAPI({
    bdcName: currentBdcName.value
  }).then(rsp => {
    const list = (rsp?.data || []).map(item => {
      return {
        name: item.name,
        value: item.name
      }
    })
    propertiesOptions.value.apps = list
    if (!props.filter.app) {
      handleChange({ app: list[0]?.value })
    }
  })
}

const getPods = () => {
  propertiesOptions.value.pods = []
  const appName = props.filter.app

  if (!appName) return

  return getAppPodsAPI({
    appName
  }).then(rsp => {
    const pods = (rsp?.data || []).map(item => {
      return {
        name: get(item, 'metadata.name'),
        value: get(item, 'metadata.name')
      }
    })

    propertiesOptions.value.pods = pods

    const changeData = { podNames: pods.map(item => item.value).join('|') }
    if (pods.every(item => item.value !== props.filter.pod)) {
      changeData.pod = '.+'
    }
    handleChange({ ...changeData })
  })
}

const getContainers = () => {
  const { filter: { app: appName, pod: podName } } = props
  propertiesOptions.value.containers = []

  if (!(appName && podName && podName !== '.+')) return

  return getAppPodDetailAPI({
    appName,
    podName
  }).then(rsp => {
    const containers = get(rsp, 'data.containers', []).map(item => {
      return {
        name: item.name,
        value: item.name
      }
    })
    propertiesOptions.value.containers = containers
    if (containers.every(item => item.value !== props.filter.container)) {
      handleChange({ container: '.+' })
    }
  })
}

const changeApp = () => {
  handleChange({ pod: '.+', podNames: '' })
  getPods()
}

const changePod = () => {
  handleChange({ container: '.+' })
  getContainers()
}

const reset = () => {
  const defaultApp = propertiesOptions.value.apps[0]?.value
  emits('reset', {
    namespace: currentBdcNS.value,
    app: defaultApp,
    podNames: props.filter.podNames
  })
  if (props.filter.app !== defaultApp) {
    handleChange({ app: defaultApp })
    changeApp()
  }
  propertiesOptions.value.containers = []
}

const initData = () => {
  getApps(true)
  getPods(true)
  getContainers(true)
}

watch(() => currentBdcNS.value, (val) => {
  if (val) {
    handleChange({ namespace: val })
    initData()
  }
}, { immediate: true })

</script>

<template lang="pug">
.record-log-search
  SearchBox(
    :model-value="filter",
    :properties="properties",
    :action-btns="[{ value: 'reset', type: 'default' }]",
    @reset="reset",
    @update:model-value="$emit('change', $event)"
    @change-app="changeApp",
    @change-pod="changePod"
  )
    template(#searchAfter)
      slot
</template>