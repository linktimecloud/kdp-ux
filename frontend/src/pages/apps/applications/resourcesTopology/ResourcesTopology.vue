<script>
import LogicFlow from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'

import { get } from 'lodash'
import { getAppResourcesTopologyAPI } from '@/api/applications'

import { CustomNodeType, CustomEdgeType } from './constant'
import { formatLogicFlowData } from './utils'

export default {
  name: 'application-resources-topology',
  props: {
    appName: {
      type: String,
      required: true
    },
    appBasicData: {
      type: Object,
      required: true
    },
    refreshFlag: Number
  },
  data () {
    return {
      topologyResources: [],
      lfInstance: null,
      processing: {
        fetch: false
      }
    }
  },
  computed: {
    logicFlowRenderData () {
      const { appName, appBasicData } = this
      const list = [{
        name: appName,
        kind: this.$t('applications.app'),
        isRoot: true,
        appCatalog: appBasicData.catalog,
        leafNodes: this.topologyResources.map(item => {
          return {
            ...item,
            leafNodes: item?.resourceTree?.leafNodes || []
          }
        })
      }]
      return formatLogicFlowData(list, { x: 200, y: 400 })
    }
  },
  methods: {
    getTopologyResources () {
      const self = this
      const { appName } = self

      self.processing.fetch = true

      getAppResourcesTopologyAPI({
        appName
      }).then(rsp => {
        self.topologyResources = get(rsp, 'data') || []
        self.initLogicFlow()
      }).finally(() => {
        self.processing.fetch = false
      })
    },
    initLogicFlow () {
      const self = this

      const containerDom = this.$refs.topologyContainer
      if (!containerDom) {
        return
      }

      const lfInstance = new LogicFlow({
        container: containerDom,
        isSilentMode: true
      })
      lfInstance.register(CustomNodeType)
      lfInstance.register(CustomEdgeType)
      lfInstance.render(this.logicFlowRenderData)

      lfInstance.on('custom:click-pod', (data) => {
        const { path, query } = self.$route
        const target = {
          path,
          query: {
            ...query,
            pod: data.name,
            appForm: this.appBasicData?.appForm
          }
        }
        const routes = self.$router.resolve(target)
        window.open(routes.href, '_blank')
      })

      this.lfInstance = lfInstance
    },
    handleZoom (isZoomIn) {
      const { lfInstance } = this
      lfInstance && lfInstance.zoom(isZoomIn)
    },
    handleResetZoom () {
      const { lfInstance } = this
      if (lfInstance) {
        lfInstance.resetZoom()
        lfInstance.resetTranslate()
      }
    }
  },
  mounted () {
    this.getTopologyResources()
  },
  watch: {
    refreshFlag () {
      this.getTopologyResources()
    }
  }
}
</script>

<template lang="pug">
.application-resources-topology.shadow-box(v-loading="processing.fetch")
  .control-box(v-if="lfInstance")
    el-button-group
      el-button(@click="handleResetZoom")
        i.ri-map-pin-2-line.mr-0
      el-button(@click="handleZoom(true)")
        i.ri-add-line.mr-0
      el-button(@click="handleZoom(false)")
        i.ri-subtract-line.mr-0
  .topology-container(ref="topologyContainer")
</template>

<style lang="scss">
.application-resources-topology {
  position: relative;
  height: calc(100vh - 250px);
  .control-box {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
    .el-button {
      padding: 4px 8px;
    }
    i {
      font-size: 16px;
    }
  }
  .topology-container {
    width: 100%;
    height: 100%;

    .lf-graph {
      background-color: #f8faff;
    }
  }
}
</style>
