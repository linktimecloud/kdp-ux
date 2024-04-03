<script>
import { mapGetters } from 'vuex'
import Ajax from '@/api/ajax'
import { get } from 'lodash'

import { DEFAULT_OPTIONS } from '@/constant/application'
import SearchBox from '@/common/searchBox'

export default {
  name: 'record-log-search',
  props: {
    filter: {
      required: true,
      type: Object
    },
    hiddenItems: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      propertiesOptions: {
        apps: [],
        pods: [],
        containers: []
      },
      processing: {}
    }
  },
  computed: {
    ...mapGetters([
      'currentBdcName',
      'currentBdcNS'
    ]),
    properties () {
      const { propertiesOptions: { apps, pods, containers }, hiddenItems } = this
      const ret = [
        {
          name: 'keyword',
          label: '',
          type: 'input',
          suffixIcon: 'ri-search-line',
          placeholder: `${this.$t('common.input')}${this.$t('dashboard.logContenKeywords')}`
        },
        {
          name: 'app',
          label: this.$t('applications.instance'),
          type: 'select',
          clearable: false,
          options: apps
        },
        {
          name: 'pod',
          label: this.$t('applications.appPod'),
          type: 'select',
          options: DEFAULT_OPTIONS().concat(pods),
          clearable: false
        },
        {
          name: 'container',
          label: this.$t('applications.container'),
          type: 'select',
          options: DEFAULT_OPTIONS().concat(containers),
          clearable: false
        }
      ]

      return ret.filter(item => !hiddenItems.includes(item.name))
    }
  },
  methods: {
    getApps (loading) {
      const self = this
      const { currentBdcName } = self

      return currentBdcName && new Ajax({
        resource: 'GET_APPLICATIONS',
        data: {
          bdcName: currentBdcName
        },
        success (rsp = {}) {
          const list = (rsp?.data || []).map(item => {
            return {
              name: item.name,
              value: item.name
            }
          })
          self.propertiesOptions.apps = list
          if (!self.filter.app) {
            self.filter.app = list[0]?.value
          }
        },
        loading
      }).fetch()
    },
    getPods (loading) {
      const self = this
      self.propertiesOptions.pods = []
      const appName = self.filter.app

      return appName && new Ajax({
        resource: {
          name: 'GET_APPLICATION_PODS',
          sets: {
            appName
          }
        },
        success (rsp = {}) {
          const pods = (rsp?.data || []).map(item => {
            return {
              name: get(item, 'metadata.name'),
              value: get(item, 'metadata.name')
            }
          })

          self.propertiesOptions.pods = pods

          self.filter.podNames = pods.map(item => item.value).join('|')
          if (pods.every(item => item.value !== self.filter.pod)) {
            self.filter.pod = '.+'
          }
        },
        loading
      }).fetch()
    },
    getContainers (loading) {
      const self = this
      const { filter: { app: appName, pod: podName } } = this
      self.propertiesOptions.containers = []

      return appName && podName && podName !== '.+' && new Ajax({
        resource: {
          name: 'GET_APPLICATION_POD_DETAIL',
          sets: {
            appName,
            podName
          }
        },
        success (rsp = {}) {
          const containers = get(rsp, 'data.containers', []).map(item => {
            return {
              name: item.name,
              value: item.name
            }
          })
          self.propertiesOptions.containers = containers
          if (containers.every(item => item.value !== self.filter.container)) {
            self.filter.container = '.+'
          }
        },
        loading
      }).fetch()
    },
    changeApp () {
      this.filter.pod = '.+'
      this.filter.podNames = ''
      this.getPods()
    },
    changePod () {
      this.filter.container = '.+'
      this.getContainers()
    },
    reset () {
      const defaultApp = this.propertiesOptions.apps[0]?.value
      this.$emit('reset', {
        namespace: this.currentBdcNS,
        app: defaultApp,
        podNames: this.filter.podNames
      })
      if (this.filter.app !== defaultApp) {
        this.filter.app = defaultApp
        this.changeApp()
      }
      this.propertiesOptions.containers = []
    },
    async initData () {
      await this.getApps(true)
      await this.getPods(true)
      await this.getContainers(true)
    }
  },
  components: {
    SearchBox
  },
  watch: {
    currentBdcNS: {
      handler (val) {
        if (val) {
          this.filter.namespace = val
          this.initData()
        }
      },
      immediate: true
    }
  }
}
</script>

<template lang="pug">
.record-log-search
  SearchBox(
    :data="filter",
    :properties="properties",
    :actionBtns="[{ value: 'reset', label: $t('common.reset'), type: 'default' }]",
    @reset="reset",
    @change-app="changeApp",
    @change-pod="changePod"
  )
    template(slot="searchAfter")
      slot
</template>
