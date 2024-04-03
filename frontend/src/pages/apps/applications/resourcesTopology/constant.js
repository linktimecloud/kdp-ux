import { RectNodeModel, HtmlNode, BezierEdge, BezierEdgeModel } from '@logicflow/core'
import Vue from 'vue'
import CustomNode from './customNode.vue'

export const TOPOLOGY_BOX_WIDTH = 240

export const TOPOLOGY_BOX_HEIGHT = 50

export const TOPOLOGY_BOX_GAP_X = TOPOLOGY_BOX_WIDTH + 100

export const TOPOLOGY_BOX_GAP_Y = 80

export const ICON_NAMES = ['Service', 'Deployment', 'Pod', 'Endpoints', 'Secret', 'ConfigMap', 'ServiceAccount']

class CustomNodeModel extends RectNodeModel {
  initNodeData (data) {
    super.initNodeData(data)
    this.width = TOPOLOGY_BOX_WIDTH
    this.height = TOPOLOGY_BOX_HEIGHT
    this.radius = 10
    this.isHitable = false
  }
}
class CustomNodeView extends HtmlNode {
  setHtml (rootEl) {
    const el = document.createElement('div')
    rootEl.innerHTML = ''
    rootEl.appendChild(el)

    const { properties } = this.props.model
    const { graphModel } = this.props
    const VNode = Vue.extend({
      render (h) {
        return h(CustomNode, {
          props: {
            properties
          },
          on: {
            onClickPod: (data) => {
              graphModel.eventCenter.emit('custom:click-pod', data)
            }
          }
        })
      }
    })
    new VNode().$mount(el)
  }
}

class CustomEdgeModel extends BezierEdgeModel {
  initEdgeData (data) {
    super.initEdgeData(data)
    this.isHitable = false
  }

  getEdgeStyle () {
    const edgeStyle = super.getEdgeStyle()
    edgeStyle.strokeDasharray = '3 3'
    edgeStyle.strokeWidth = 1
    edgeStyle.stroke = '#969696'
    return edgeStyle
  }
}

export const CustomNodeType = {
  type: 'CustomNodeType',
  view: CustomNodeView,
  model: CustomNodeModel
}

export const CustomEdgeType = {
  type: 'CustomEdgeType',
  view: BezierEdge,
  model: CustomEdgeModel
}
