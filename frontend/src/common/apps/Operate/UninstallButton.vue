<script setup>
import { computed } from 'vue'
import { get } from 'lodash'
import i18n from '@/i18n'

import { ElMessageBox } from 'element-plus'
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

const handleConfirm = () => {
  const { data: { appName: name, bdc } } = props

  ElMessageBox.prompt(i18n.t('applications.uninstallConfirm', { name, bdc }), i18n.t('common.attention'), {
    type: 'warning',
    inputPattern: new RegExp('^' + name + '$'),
    inputErrorMessage: i18n.t('applications.inputAppNameError'),
    customClass: 'has-input-confirm-box'
  }).then(({ value }) => {
    if (value === name) {
      uninstallApp()
    }
  }).catch(() => {})
}

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
</script>

<template lang="pug">
.uninstall-app-button
  ReasonButton(
    :cls="['text-danger']",
    :btnOptions="btnOptions",
    @click="handleConfirm"
  )
    slot
      span {{ $t('common.uninstall') }}
</template>
