<script>
import { get } from 'lodash'
import { getDashboardConfigAPI } from '@/api/dashboard'

import PanelCard from './panelCard/PanelCard.vue'

export default {
  name: 'DashboardPanels',
  components: {
    PanelCard
  },
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
  },
  mounted () {
    this.getDashboardConfig()
  },
  methods: {
    async getDashboardConfig () {
      const { name } = this
      const rsp = await getDashboardConfigAPI({ name })
      this.dataConfig = get(rsp, 'data', {})
      this.setPanelVariables()
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
  }
}
</script>

<template lang="pug">
.dashboard-panels(:class="`dashboard-name-${name}`")
  PanelCard(
    v-for="item in panels",
    :key="item.title",
    v-model:show-panels="showPanels",
    :data="item",
    :style="getPanelLayoutStyle(item)",
    :time-query="timeQuery",
    :panel-variables="panelVariables"
    :scope-tpl-list="getScopeTplList(item)",
    :name="name",
    :prometheus-health="dataConfig.prometheusHealth",
    @restore-show-panels="restoreShowPanels"
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
