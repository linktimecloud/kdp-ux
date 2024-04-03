<script>
import { get } from 'lodash'

import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'
import { deleteAppPodAPI } from '@/api/applications'

import ReasonButton from '@/common/ReasonButton.vue'

export default {
  name: 'pod-delete-button',
  props: {
    podData: {
      type: Object,
      required: true
    }
  },
  computed: {
    reqData () {
      const { podData: { podName: name } } = this
      return {
        appendWebhook: true,
        processInfo: {
          handle: 'delete',
          category: 'pod',
          name
        }
      }
    }
  },
  methods: {
    handleConfirm () {
      const { podData: { podName: name } } = this
      this.$confirm(this.$t('applications.podDeleteConfirm', { name }), this.$t('common.attention'), {
        type: 'warning'
      }).then(() => {
        this.deletePod()
      }).catch(() => {})
    },
    deletePod () {
      const self = this
      const { reqData, podData: { podName, appName } } = self

      deleteAppPodAPI({ podName, appName, data: reqData }).then((rsp) => {
        const id = get(rsp, 'data.pid')
        id && processRedirect({
          id,
          refresh () {
            toast.log(
              self.$t('common.actionSuccess'),
              { type: 'success' }
            )
            self.$emit('refresh')
          },
          direct: false
        })
      })
    }
  },
  components: {
    ReasonButton
  }
}
</script>

<template lang="pug">
.pod-delete-button
  ReasonButton(
    :btnOptions="{ link: true }",
    @click="handleConfirm"
  )
    slot
      span {{ $t('common.delete') }}
</template>
