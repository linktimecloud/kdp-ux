
import { h } from 'vue'
import i18n from '@/i18n'
import { ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { useRouter } from 'vue-router'

import ProcessStatus from '@/common/process/ProcessContent.vue'

const router = useRouter()

export const processRedirect = ({ id, refresh, direct }) => {
  if (direct) {
    router.push({ name: 'process', query: { id } })
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
    beforeClose (instance, done) {
      const processInstance = instance?.message?.component
      const setupState = processInstance?.setupState || {}

      if (isFunction(setupState.stop)) {
        setupState.stop()
      }
      const { status } = setupState
      if (status === 1 || status === 3) {
        isFunction(refresh) && refresh()
      }
      done()
    }
  }).then((action) => {
      if (action === 'confirm') {
        router.push({ name: 'process', query: { id } })
      }
    })
    .catch(() => {})
}
