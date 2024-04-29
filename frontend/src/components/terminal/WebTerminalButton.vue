<script setup>
import { computed, onMounted, ref } from 'vue'
import { get } from 'lodash'

import EmptyHolder from '@/components/empty/EmptyHolder.vue'

import { postTerminalAPI, postPodContainerTerminalAPI } from '@/api/applications'
import { useTerminalStore } from '@/stores/modules/terminal'

const terminalStore = useTerminalStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  sign: {
    type: String,
    default: 'general'
  }
})

const processing = ref(false)

const resource = computed(() => {
  const map = {
    general: {
      apiName: postTerminalAPI
    },
    podContainer: {
      apiName: postPodContainerTerminalAPI,
      params: {
        ...props.data
      }
    }
  }
  return map[props.sign]
})

const getTerminalUrl = async () => {
  const apiName = get(resource, 'value.apiName')
  const params = get(resource, 'value.params', {})

  processing.value = true
  terminalStore.setTerminalUrl('')
  await apiName({ ...params }).then((rsp) => {
    const phase = get(rsp, 'data.phase')
    if (phase === 'Ready') {
      const url = get(rsp, 'data.accessUrl', '')
      terminalStore.setTerminalUrl(url)
    }
  }).finally(() => {
    processing.value = false
  })
}
</script>

<template lang="pug">
.web-terminal-button
  el-button(link, :disabled="processing", @click="getTerminalUrl")
    slot
      span.text-white
        i.ri-terminal-line(v-if="!processing")
        i.ri-loader-2-line.spin(v-else)
        span.ml-2 {{ $t('applications.webTerminal') }}
</template>