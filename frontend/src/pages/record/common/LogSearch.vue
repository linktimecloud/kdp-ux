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

const emits = defineEmits(['change', 'reset', 'changeLoading'])
const logFilter = ref({ ...props.filter })

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
    if (!logFilter.value.app) {
      logFilter.value.app = list[0]?.value
    }
  })
}

const getPods = () => {
  propertiesOptions.value.pods = []
  logFilter.value.podNames = ''
  const appName = logFilter.value.app

  if (!appName) return
  emits('changeLoading', true)
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

    logFilter.value.podNames = pods.map(item => item.value).join('|')
    if (pods.every(item => item.value !== logFilter.value.pod)) {
      logFilter.value.pod = '.+'
    }
  }).finally(() => {
    emits('changeLoading', false)
  })
}

const getContainers = () => {
  const { app: appName, pod: podName } = logFilter.value
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
    if (containers.every(item => item.value !== logFilter.value.container)) {
      logFilter.value.container = '.+'
    }
  })
}

const changeApp = async () => {
  logFilter.value.pod = '.+'
  logFilter.value.podNames = ''
  await getPods()
}

const changePod = () => {
  logFilter.value.container = '.+'
  getContainers()
}

const reset = async () => {
  const defaultApp = propertiesOptions.value.apps[0]?.value
  if (logFilter.value.app !== defaultApp) {
    logFilter.value.app = defaultApp
    await changeApp()
  }
  emits('reset', {
    namespace: currentBdcNS.value,
    app: defaultApp,
    podNames: logFilter.value.podNames
  })
  propertiesOptions.value.containers = []
}

const initData = async () => {
  await getApps()
  await getPods()
  await getContainers()
}

watch(() => currentBdcNS.value, (val) => {
  if (val) {
    logFilter.value.namespace = val
    initData()
  }
}, { immediate: true })

watch(() => logFilter.value, () => {
  emits('change', logFilter.value)
}, { deep: true })

watch(() => props.filter, (val) => {
  logFilter.value = val
})

</script>

<template lang="pug">
.record-log-search
  SearchBox(
    v-model="logFilter",
    :properties="properties",
    :action-btns="[{ value: 'reset', type: 'default' }]",
    @reset="reset",
    @change-app="changeApp",
    @change-pod="changePod"
  )
    template(#searchAfter)
      slot
</template>