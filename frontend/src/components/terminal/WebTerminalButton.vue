<script setup>
import { computed, ref } from 'vue'
import { get, isEmpty } from 'lodash'

import { postTerminalAPI, postPodContainerTerminalAPI } from '@/api/applications'
import { useTerminalStore } from '@/stores/modules/terminal'

const terminalStore = useTerminalStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  hasIcon: {
    type: Boolean,
    default: true
  },
  onlyRefresh: {
    type: Boolean,
    default: false
  }
})

const processing = ref(false)

const resource = computed(() => {
  let sign = 'general'
  if (!isEmpty(props.data)) {
    sign = 'podContainer'
  }
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
  return map[sign]
})

const emit = defineEmits(['refresh'])

const getTerminalUrl = async () => {
  const apiName = get(resource, 'value.apiName')
  const params = get(resource, 'value.params', {})
  if (!props.onlyRefresh) {
    terminalStore.initTerminalProperty()
    terminalStore.setTerminalProperty('terminalData', params)
  }

  processing.value = true
  await apiName({ ...params }).then((rsp) => {
    const phase = get(rsp, 'data.phase')
    if (phase === 'Ready') {
      const url = get(rsp, 'data.accessUrl', '')
      terminalStore.setTerminalProperty('terminalUrl', url)
    }
    terminalStore.setTerminalProperty('showTerminal', true)
    if (props.onlyRefresh) {
      emit('refresh')
    }
  }).finally(() => {
    processing.value = false
  })
}
</script>

<template lang="pug">
.web-terminal-button
  el-button(v-if="!onlyRefresh", link, :disabled="processing", @click="getTerminalUrl")
    span(:class="{ 'text-white': hasIcon }")
      i.ri-terminal-box-line(v-if="!processing && hasIcon")
      i.ri-loader-2-line.spin(v-if="processing")
      span.ml-2 {{ $t('applications.webTerminal') }}
  el-button(v-else, link, :disabled="processing", @click="getTerminalUrl")
    i.text-white(:class="processing ? 'ri-loader-2-line spin' : 'ri-refresh-line'")
</template>