<script setup>
import { computed } from 'vue'
import { get } from 'lodash'
import { ElMessageBox } from 'element-plus'
import i18n from '@/i18n'

import { processRedirect } from '@/utils/process'
import { deleteAppPodAPI } from '@/api/applications'

import ReasonButton from '@/common/ReasonButton.vue'

const props = defineProps({
  podData: {
    type: Object,
    required: true
  }
})

const reqData = computed(() => {
  const { podData: { podName: name } } = props
  return {
    appendWebhook: true,
    processInfo: {
      handle: 'delete',
      category: 'pod',
      name
    }
  }
})

const handleConfirm = () => {
  const { podData: { podName: name } } = props
  ElMessageBox.alert(i18n.t('applications.podDeleteConfirm', { name }), i18n.t('common.attention'), {
    type: 'warning'
  }).then(() => {
    deletePod()
  }).catch(() => {})
}

const emit = defineEmits(['refresh'])

const deletePod = () => {
  const { podData: { podName, appName } } = props
  deleteAppPodAPI({ podName, appName, data: reqData.value }).then((rsp) => {
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
.pod-delete-button
  ReasonButton(
    :btn-options="{ link: true }",
    @click="handleConfirm"
  )
    slot
      span {{ $t('common.delete') }}
</template>
