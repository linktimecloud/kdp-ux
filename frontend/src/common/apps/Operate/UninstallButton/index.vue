<script>
import { get } from 'lodash'
import Ajax from '@/api/ajax'

import { processRedirect } from '@/utils/process'
import toast from '@/utils/toast'

import ReasonButton from '@/common/reasonButton'

export default {
  name: 'uninstall-app-button',
  props: {
    appName: {
      type: String,
      default: ''
    },
    btnType: {
      type: String,
      default: 'text'
    },
    bdc: {
      type: String,
      default: ''
    }
  },
  computed: {
    reqData () {
      const { appName: name } = this
      return {
        appendWebhook: true,
        processInfo: {
          handle: 'uninstall',
          category: 'application',
          name
        }
      }
    }
  },
  methods: {
    handleConfirm () {
      const { appName: name, bdc } = this
      this.$prompt(this.$t('applications.uninstallConfirm', { name, bdc }), this.$t('common.attention'), {
        type: 'warning',
        inputPattern: new RegExp('^' + name + '$'),
        inputErrorMessage: this.$t('applications.inputAppNameError'),
        customClass: 'has-input-confirm-box'
      }).then(({ value }) => {
        if (value === name) {
          this.uninstallApp()
        }
      }).catch(() => {})
    },
    uninstallApp () {
      const self = this
      const { appName, reqData } = this

      const resource = {
        name: 'DELETE_APPLICATION',
        sets: {
          appName
        }
      }
      appName && new Ajax({
        resource,
        data: reqData,
        success (rsp = {}) {
          const id = get(rsp, 'data.pid')
          processRedirect({
            id,
            cb () {
              toast.log(
                self.$t('applications.startProcessing'),
                { type: 'info' }
              )
            },
            refresh () {
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
.uninstall-app-button
  ReasonButton(
    :type="btnType",
    :cls="['text-danger']",
    @click="handleConfirm"
  )
    slot
      span {{ $t('common.uninstall') }}
</template>
