import Vue from 'vue'
import { isFunction, get } from 'lodash'

import Store from '@/store'

import router from '@/router'
import i18n from '@/i18n'

import ProcessStatus from '@/common/process'

const vm = new Vue({
  i18n,
  router,
  components: {
    ProcessStatus
  },
  methods: {
    trigger (func) {
      isFunction(func) && func()
    },
    noticeLog ({ id, sub, refresh, direct }) {
      const self = this

      const name = 'process'
      const query = { id, sub }

      const h = self.$createElement
      const customClass = 'el-message-box--lg'

      if (direct) {
        self.$router.push({ name, query })
        return false
      } else {
        Store.dispatch('setLoadingOptions', {
          show: 0
        })
      }

      self.$msgbox({
        customClass,
        title: self.$t('menu.process'),
        message: h('ProcessStatus', {
          props: { id }
        }),
        confirmButtonText: self.$t('menuDesc.process'),
        cancelButtonText: self.$t('common.close'),
        showCancelButton: true,
        beforeClose (action, instance, done) {
          const vnodes = instance.$slots.default || []
          const vnode = vnodes[0] || {}
          const vnodeComponent = vnode.componentInstance || {}
          if (isFunction(vnodeComponent.stop)) {
            vnodeComponent.stop()
          }
          vnodeComponent.propsData = { id: null }
          vnodeComponent.$el = null
          const status = get(instance, '$slots.default[0].componentInstance.status')
          if (status === 1 || status === 3) {
            self.trigger(refresh)
          }
          done()
        }
      }).then(action => {
        if (action === 'confirm') {
          self.$router.push({ name, query })
        }
      }).catch(() => {
      })
    }
  }
})

export const processRedirect = async ({ id, sub, cb, route, refresh, mode = 'log', direct = true }) => {
  const args = { id, sub, refresh, direct }
  if (mode === 'log') {
    vm.noticeLog(args)
  } else {
    route && router.push(route)
  }
  vm.trigger(cb)
}
