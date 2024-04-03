/**
 * Import base styles
 */
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/brands.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import 'remixicon/fonts/remixicon.css'
import 'animate.css/animate.css'
import '@/main.scss'

// TODO: service worker
// /**
//  * Import OfflinePluginRuntime
//  */
import * as OfflinePluginRuntime from 'offline-plugin/runtime'

/**
 * Import Framework
 */
import Vue from 'vue'
import ElementUI from 'element-ui'

import { mapGetters, mapActions } from 'vuex'
import { sync } from 'vuex-router-sync'

import VueMq from 'vue-mq'

/**
 * Import modules
 */
import { Local } from '@/utils/storage'
import filters from '@/utils/filters'
import directives from '@/utils/directives'
/**
 * Import localization
 */
import i18n from '@/i18n'

import App from '@/App'
import router from '@/router'
import store from '@/store'

/**
 * Disable Vue Devtool in production env
 */
import { NODE_ENV, DEV_TOOL } from '@/env'

const HIDE_DEV_TOOL = NODE_ENV === 'production' && !DEV_TOOL
Vue.config.silent = HIDE_DEV_TOOL
Vue.config.debug = !HIDE_DEV_TOOL
Vue.config.devtools = !HIDE_DEV_TOOL
Vue.config.productionTip = !HIDE_DEV_TOOL

if (NODE_ENV === 'production') {
  /**
   * OfflinePluginRuntime
   */
  // TODO: service worker
  OfflinePluginRuntime.install()
}

/**
 * Use plugins
 */
Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(filters)
Vue.use(directives)
Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    narrow: 1280,
    lg: 1920,
    xl: Infinity
  }
})

/**
 * vuex-router-sync
 */
sync(store, router, { moduleName: 'route' })

/**
 * Handlers
 */
// let redirectionConfirmShown = false

/**
 * Vue Root Component
 */
const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  computed: {
    ...mapGetters([
      'ws',
      'lang',
      'company',
      'customizeEnv',
      'entry',
      'currentUser'
    ])
  },
  methods: {
    ...mapActions([
      'setLang',
      'setCurrentUser',
      'setCurrentBdc',
      'setLoadingOptions',
      'behaviorUpdate',
      'setLayoutCollapse'
    ]),
    cancelLoading () {
      this.setLoadingOptions({ show: 0 })
    },
    hashName () {
      const hash = window.location.hash || ''
      const ret = /^#\/(.*)/ig.exec(hash.split('?')[0]) || []
      return this.$route.name || ret[1]
    },
    routeIntercept () {
      const self = this
      const routeName = self.hashName()

      console.log('routeIntercept: ', {
        routeName,
        company: self.company
      })
    },
    async init () {
      const self = this
      await self.setCurrentUser()
      await self.setCurrentBdc()
      self.applyCustomize()
      self.routeIntercept()
    },
    applyCustomize () {
      const { customizeEnv = {} } = this
      const features = customizeEnv.features || {}

      if (features.LANG && Local.getItem('lang')) {
        this.setLang(Local.getItem('lang'))
      }
    },
    unregisterServiceWorker () {
      // jira BPAAS-1404
      try {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach(item => item.unregister())
        })
      } catch (e) {}
    }
  },
  created () {
    this.init()
    this.unregisterServiceWorker()
  },
  mounted () {
    this.setLayoutCollapse(this.$mq === 'narrow')
  },
  watch: {
    '$mq' (mq) {
      this.setLayoutCollapse(mq === 'narrow')
    },
    company (company, oCompany) {
      if (oCompany && !['COMMON'].includes(oCompany)) {
        this.routeIntercept()
        this.applyCustomize()
      }
    }
  }
})

/**
 * Router inteceptions
 */
router.beforeEach((to, from, next) => {
  vm.cancelLoading()
  const toHome = { name: vm.entry }
  if (vm.disabledMenuList && to.matched.some(record => vm.disabledMenuList.includes(record.name))) {
    next(toHome)
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // track router updates
  vm.behaviorUpdate({ type: 'path', to, from })

  // inject bdtj scripts
  const hmt = window._hmt
  if (hmt && to.path) {
    hmt.push(['_trackPageview', '/#' + to.fullPath])
  }
})
