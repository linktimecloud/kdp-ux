import axios from 'axios'
import { toString } from 'lodash'
import { ElLoading, ElMessageBox } from 'element-plus'
import { h } from 'vue'
import i18n from '@/i18n'
import toast from '@/utils/toast'
import { DEFAULT_LANG } from '@/env'

import ServiceErrorModal from '@/components/error/ServiceErrorModal.vue'

let loadingInstance

const handleServiceError = (responseData, options) => {
  const { error, message, status } = responseData

  if (options.toast) {
    const { app, info = {}, type = 'warning' } = error || {}

    const errorMsgs = []
    if (app) {
      errorMsgs.push(`${i18n.t('error.app')}: ${app}`)
    }
    if (info?.description) {
      errorMsgs.push(`${i18n.t('error.description')}: ${info.description}`)
    }

    const cb = () => {
      ElMessageBox({
        customClass: 'request-error-message-box',
        title: i18n.t('common.serviceError'),
        showConfirmButton: false,
        message: h(ServiceErrorModal, {
          data: error
        })
      }).then(() => {}).catch(() => {})
    }
    const isValidType = ['success', 'warning', 'error'].includes(type)
    const title = info?.solution || info?.description || message
    toast.error(
      title,
      errorMsgs,
      {
        type: isValidType ? type : DEFAULT_TYPE,
        cb
      }
    )
  }
}

const instance = axios.create({
  baseURL: '/api',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept-Language': DEFAULT_LANG
  },
})

instance.interceptors.request.use(
  (config) => {
    if (config.loading) {
      loadingInstance = ElLoading.service({
        customClass: 'global-loading-mask'
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close()

    const status = toString(response.data?.status)

    if (status === '100000') {
      return response.data
    } else {
      handleServiceError(response.data, {
        ...response.config,
        toast: response.config?.toast ?? true
      })
      return Promise.reject(response.data)
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    let { message } = error

    toast.log({
      title: 'Fetch Error',
      message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default instance
