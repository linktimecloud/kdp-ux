<script>
import { get } from 'lodash'

import { getAppListAPI, getAppPodsAPI, getAppPodDetailAPI } from '@/api/applications'

import { DEFAULT_OPTIONS } from '@/constant/application'
import SearchBox from '@/common/SearchBox.vue'

import { useBdcStore } from '@/stores/modules/bdc'
const bdcStore = useBdcStore()

export default {
  name: 'RecordLogSearch',
  components: {
    SearchBox
  },
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
    currentBdcName () {
      return bdcStore.currentBdcName
    },
    currentBdcNS () {
      return bdcStore.currentBdcNS
    },
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
  watch: {
    currentBdcNS: {
      handler (val) {
        if (val) {
          this.$emit('update:filter', { ...this.filter, namespace: val })
          this.initData()
        }
      },
      immediate: true
    }
  },
  methods: {
    getApps () {
      const self = this
      const { currentBdcName } = self

      if (!currentBdcName) return

      return getAppListAPI({
        bdcName: currentBdcName
      }).then(rsp => {
        const list = (rsp?.data || []).map(item => {
          return {
            name: item.name,
            value: item.name
          }
        })
        self.propertiesOptions.apps = list
        if (!self.filter.app) {
          self.$emit('update:filter', { ...self.filter, app: list[0]?.value })
        }
      })
    },
    getPods (appName) {
      const self = this
      self.propertiesOptions.pods = []

      if (!appName) return

      return getAppPodsAPI({
        appName
      }).then(rsp => {
        const pods = (rsp?.data || []).map(item => {
          return {
            name: get(item, 'metadata.name'),
            value: get(item, 'metadata.name')
          }
        })

        self.propertiesOptions.pods = pods
        let data = {}
        data.podNames = pods.map(item => item.value).join('|')
        if (pods.every(item => item.value !== self.filter.pod)) {
          data.pod = '.+'
        }
        self.$emit('update:filter', { ...self.filter, ...data })
      })
    },
    getContainers (podName) {
      const self = this
      const { filter: { app: appName } } = this
      self.propertiesOptions.containers = []
      if (!(appName && podName && podName !== '.+')) return

      return getAppPodDetailAPI({
        appName,
        podName
      }).then(rsp => {
        const containers = get(rsp, 'data.containers', []).map(item => {
          return {
            name: item.name,
            value: item.name
          }
        })
        self.propertiesOptions.containers = containers
        if (containers.every(item => item.value !== self.filter.container)) {
          self.$emit('update:filter', { ...self.filter, container: '.+' })
        }
      })
    },
    reset () {
      const defaultApp = this.propertiesOptions.apps[0]?.value
      this.$emit('reset', {
        namespace: this.currentBdcNS,
        app: defaultApp,
        podNames: this.filter.podNames
      })
      this.propertiesOptions.containers = []
    },
    async initData () {
      await this.getApps()
      await this.getPods(this.filter.app)
      await this.getContainers()
    },
    handleChange (data) {
      let ret = { ...this.filter }
      ret[data.propName] = data.newValue
      if (data.propName === 'app') {
        ret.pod = '.+'
        ret.podNames = ''
        this.getPods()
      }
      if (data.propName === 'pod') {
        ret.container = '.+'
        this.getContainers(data.newValue)
      }
      this.$emit('update:filter', ret)
    }
  }
}
</script>

<template lang="pug">
.record-log-search
  SearchBox(
    :data="filter",
    :properties="properties",
    :action-btns="[{ value: 'reset', label: $t('common.reset'), type: 'default' }]",
    @reset="reset",
    @handle-change="data => handleChange(data)"
  )
    template(#searchAfter)
      slot
</template>
