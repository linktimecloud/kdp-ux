<script>
import { get } from 'lodash'
import Ajax from '@/api/ajax'

import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'

import ReasonButton from '@/common/reasonButton'

export default {
  name: 'pod-delete-button',
  props: {
    podData: {
      type: Object,
      required: true
    },
    btnType: {
      type: String,
      default: 'text'
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

      const resource = {
        name: 'DELETE_APPLICATION_POD',
        sets: {
          podName,
          appName
        }
      }
      podName && appName && new Ajax({
        resource,
        data: reqData,
        success (rsp = {}) {
          const id = get(rsp, 'data.pid')
          processRedirect({
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
        },
        loading: true
      }).fetch()
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
    :type="btnType",
    @click="handleConfirm"
  )
    slot
      span {{ $t('common.delete') }}
</template>
