import 'noty/lib/noty.css'
import 'noty/lib/themes/bootstrap-v4.css'

import { isArray, isEmpty } from 'lodash'
import Noty from 'noty'
import Store from '@/store'
import i18n from '@/i18n'

/**
 * Noty Options
 * https://ned.im/noty/#/options
 */
Noty.overrideDefaults({
  killable: true,
  layout: 'topRight',
  theme: 'bootstrap-v4',
  closeWith: ['click', 'button'],
  animation: {
    open: 'animated bounceInRight',
    close: 'animated bounceOutRight'
  }
})
Noty.setMaxVisible(3)

const intercept = (type, payload = {}) => {
  if (!['warning', 'error'].includes(type)) {
    return
  }

  const { page, feature, resource, message } = payload
  Store.dispatch('behaviorUpdate', {
    type: 'toast',
    toastType: type,
    message,
    page,
    feature,
    resource
  })
}

const toast = {
  log (msg, obj = {}) {
    const settings = Object.assign({
      limit: 1,
      type: 'warning',
      text: obj.type
    }, obj)

    if (settings.timeout === undefined) {
      settings.timeout = settings.type === 'error' ? 10000 : 5000
    }

    if (isArray(msg)) {
      settings.text = msg.join(' ')
    } else if (typeof msg === 'string') {
      settings.text = msg
    }

    intercept(obj.type || 'warning', {
      message: settings.text,
      ...obj
    })

    // trigger toast
    if (settings.unique) {
      settings.killer = settings.queue || settings.unique
    } else if (settings.queue) {
      Noty.setMaxVisible(settings.limit, settings.queue)
    }

    // callback button
    if (!isEmpty(obj.btn)) {
      settings.buttons = [
        Noty.button(
          obj.btn.text,
          obj.btn.cls,
          obj.btn.cb,
          obj.btn.attr
        )
      ]
    }

    const NotyInstance = new Noty(settings)

    NotyInstance.show()
    return NotyInstance
  },
  error (title, msgArr, opt) {
    const type = opt.type || 'warning'
    const message = [title].concat(msgArr).join(' ')

    intercept(type, {
      message,
      type,
      ...opt
    })

    const settings = {
      type,
      timeout: 10000,
      text: `
        <div class="d-flex flex-column">
          <span class="mb-2 font-weight-bold">${title}</span>
          ${msgArr.map(msg => `<span>${msg}</span>`).join('')}
        </div>
      `,
      buttons: [
        Noty.button(
          i18n.t('common.helpDetail'),
          `el-button el-button--mini el-button--${type === 'error' ? 'danger' : 'warning'}`,
          opt.cb
        )
      ]
    }
    const NotyInstance = new Noty(settings)
    Noty.setMaxVisible(1, 'serviceError')

    NotyInstance.show()
    return NotyInstance
  },
  clear (opt = {}) {
    Noty.closeAll(opt.queue)
    Noty.clearQueue(opt.queue)
  }
}

export default toast
