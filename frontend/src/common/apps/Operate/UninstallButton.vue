<script setup>
import { ref, computed } from 'vue'
import { get } from 'lodash'
import i18n from '@/i18n'

import { processRedirect } from '@/utils/process'
import { deleteAppAPI } from '@/api/applications'

import ReasonButton from '@/common/ReasonButton.vue'

const props = defineProps({
  data: { // appName/bdc
    type: Object,
    default: () => ({})
  },
  btnOptions: {
    type: Object,
    default: () => ({ link: true })
  }
})

const visibleDialog = ref(false)
const name = ref('')

const reqData = computed(() => {
  const name = get(props, 'data.appName')
  return {
    appendWebhook: true,
    processInfo: {
      handle: 'uninstall',
      category: 'application',
      name
    }
  }
})

const submitReason = computed(() => {
  const originName = get(props, 'data.appName')
  return originName !== name.value ? i18n.t('applications.inputAppNameError') : ''
})

const emit = defineEmits(['refresh'])
const uninstallApp = () => {
  const name = get(props, 'data.appName')
  name && deleteAppAPI({ appName: name, data: reqData.value }).then((rsp) => {
    const id = get(rsp, 'data.pid')
    id && processRedirect({
      id,
      refresh () {
        emit('refresh')
      }
    })
  })
}

const open = () => {
  name.value = ''
  visibleDialog.value = true
}
</script>

<template lang="pug">
.uninstall-app-button
  ReasonButton(
    :cls="['text-danger']",
    :btn-options="btnOptions",
    @click="open"
  )
    slot
      span {{ $t('common.uninstall') }}
  el-dialog(
    v-model="visibleDialog",
    modal-class="has-input-confirm-box",
    :title="$t('common.attention')",
    width="40%",
    :close-on-click-modal="false",
    :append-to-body="true",
    @close="visibleDialog = false"
  )
    .app-uninstall-container(v-if="visibleDialog")
      .flex.mb-4
        i.remix.ri-information-fill.mr-2.text-warning
        span {{ $t('applications.uninstallConfirm', { name: data.appName, bdc: data.bdc }) }}
      el-input(v-model="name")
    template(#footer)
      .flex.justify-end.items-center
        el-button.mr-2(@click="visibleDialog = false") {{ $t('common.cancel') }}
        ReasonButton(
          type="primary",
          :reason="submitReason"
          @click="uninstallApp"
        ) {{ $t('common.confirm') }}
</template>
