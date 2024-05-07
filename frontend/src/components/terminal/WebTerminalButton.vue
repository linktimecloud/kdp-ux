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
  },
  hasIcon: {
    type: Boolean,
    default: true
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

const getTerminalUrl = async (openNewTab = false) => {
  const apiName = get(resource, 'value.apiName')
  const params = get(resource, 'value.params', {})

  processing.value = true
  terminalStore.setTerminalUrl('')
  await apiName({ ...params }).then((rsp) => {
    const phase = get(rsp, 'data.phase')
    if (phase === 'Ready') {
      const url = get(rsp, 'data.accessUrl', '')
      if (openNewTab) {
        window.open(url, '_blank')
      } else {
        terminalStore.setTerminalUrl(url)
      }
    }
  }).finally(() => {
    processing.value = false
  })
}
</script>

<template lang="pug">
.web-terminal-button
  el-dropdown(:disabled="processing")
    el-button(link, :disabled="processing")
      span(:class="{ 'text-white': hasIcon }")
        i.ri-terminal-line(v-if="!processing && hasIcon")
        i.ri-loader-2-line.spin(v-if="processing")
        span.ml-2 {{ $t('applications.webTerminal') }}
    template(#dropdown)
      el-dropdown-menu.dropdown-menu-full-button
        el-dropdown-item
          el-button(link, @click="getTerminalUrl(false)")
            .flex.more-btn
              i.ri-split-cells-vertical.mr-1
              span {{ $t('applications.splitDownwards')}}
        el-dropdown-item
          el-button(link, @click="getTerminalUrl(true)")
            .flex.more-btn
              i.ri-external-link-line.mr-1
              span {{ $t('manual.externalLink') }}
</template>