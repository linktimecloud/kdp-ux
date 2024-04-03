<script>
import { get } from 'lodash'

import Ajax from '@/api/ajax'
import PanelCard from './panelCard'

export default {
  name: 'dashboard-panels',
  props: {
    name: {
      type: String,
      required: true
    },
    timeQuery: Object,
    defaultVariables: {
      type: Object,
      defaule: () => ({})
    }
  },
  data () {
    return {
      dataConfig: {},
      panelVariables: {},
      showPanels: []
    }
  },
  computed: {
    panels () {
      return this.dataConfig.panels || []
    },
    linePanels () {
      return this.panels.filter(item => item.type === 'timeserise-line') || []
    }
  },
  methods: {
    getDashboardConfig () {
      const self = this
      const { name } = self
      new Ajax({
        resource: 'GET_DASHBOARD_CONFIG',
        data: {
          name
        },
        success (rsp = {}) {
          self.dataConfig = rsp.data || []
          self.$emit('setTplList', { name, list: get(rsp.data, 'templating.list') || [] })
          self.setPanelVariables()
        }
      }).fetch()
    },
    getPanelLayoutStyle (item) {
      const { gridPos: { h, w, x, y } = {} } = item
      return {
        'grid-column-start': x + 1,
        'grid-column-end': x + 1 + w,
        'grid-row-start': y + 1,
        'grid-row-end': y + 1 + h
      }
    },
    setPanelVariables () {
      const list = get(this.dataConfig, 'templating.list') || []
      const data = list.reduce((ret, cur) => {
        ret[cur.name] = cur.defaultVal || ''
        return ret
      }, {})

      this.panelVariables = {
        ...data,
        ...this.defaultVariables
      }
    },
    getScopeTplList (item) {
      const { name } = item
      const list = get(this.dataConfig, 'templating.list') || []
      return name ? list.filter(item => item.scopePanelName === name) : []
    },
    restoreShowPanels () {
      this.showPanels = this.panels.map(item => item.title)
    }
  },
  mounted () {
    this.getDashboardConfig()
  },
  components: {
    PanelCard
  },
  watch: {
    defaultVariables: {
      deep: true,
      handler (val) {
        this.panelVariables = {
          ...this.panelVariables,
          ...val
        }
      }
    },
    panels: {
      immediate: true,
      handler () {
        this.restoreShowPanels()
      }
    }
  }
}
</script>

<template lang="pug">
.dashboard-panels(:class="`dashboard-name-${name}`")
  PanelCard(
    v-for="item in panels",
    :key="item.title",
    :data="item",
    :style="getPanelLayoutStyle(item)",
    :timeQuery="timeQuery",
    :panelVariables="panelVariables",
    :scopeTplList="getScopeTplList(item)"
    :name="name",
    :showPanels.sync="showPanels",
    :prometheusHealth="dataConfig.prometheusHealth",
    @restoreShowPanels="restoreShowPanels"
  )
</template>

<style lang="scss">
.dashboard-panels {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(24, 1fr);
  grid-row-gap: 0.5rem;
  grid-column-gap: 0.5rem;
  &.dashboard-name-cluster_resource {
    grid-template-rows: repeat(3, 1fr);
  }
}
</style>
