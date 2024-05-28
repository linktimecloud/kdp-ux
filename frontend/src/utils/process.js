
import { h } from 'vue'
import i18n from '@/i18n'
import { ElMessageBox } from 'element-plus'
import { isFunction, toNumber } from 'lodash'

import ProcessStatus from '@/common/process/ProcessContent.vue'

const toProcess = (id) => {
  const domain = window.location.origin
  window.open(`${domain}/#/process?id=${id}`,  '_blank')
}

export const processRedirect = ({ id, refresh, direct }) => {
  if (direct) {
    toProcess(id)
    return
  }

  ElMessageBox({
    title: i18n.t('menu.process'),
    message: h(ProcessStatus, { id }),
    customClass: 'process-message-box',
    confirmButtonText: i18n.t('menu.process'),
    cancelButtonText: i18n.t('common.close'),
    showCancelButton: true,
    'close-on-click-modal': false,
    'close-on-press-escape': false,
    beforeClose (action, instance, done) {
      const processInstance = instance?.message?.component
      const setupState = processInstance?.setupState || {}

      if (isFunction(setupState.stop)) {
        setupState.stop()
      }
      const element = document.getElementById('processLogsContentStatus')
    
      if (toNumber(element?.innerText) === 1) {
        isFunction(refresh) && refresh()
      }
      done()
    }
  }).then((action) => {
      if (action === 'confirm') {
        toProcess(id)
      }
    })
    .catch(() => {})
}
