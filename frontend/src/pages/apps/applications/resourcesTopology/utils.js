import { TOPOLOGY_BOX_HEIGHT, TOPOLOGY_BOX_GAP_X, TOPOLOGY_BOX_GAP_Y } from './constant'

export const calcCoordY = ({ baseY, curIndex, curX, length, nodes }) => {
  const heightGap = TOPOLOGY_BOX_HEIGHT + TOPOLOGY_BOX_GAP_Y

  let firstY = baseY - (Math.floor(length / 2) * heightGap)

  if (length % 2 === 0) {
    firstY = firstY + (TOPOLOGY_BOX_GAP_Y + TOPOLOGY_BOX_HEIGHT) / 2
  }
  firstY = Math.max(firstY, 0)

  // Find nodes with the same x coordinate from nodes and sort them by y coordinate
  const sameXNodes = nodes.filter(node => node.x === curX).sort((a, b) => a.y - b.y)
  let ret = firstY + curIndex * heightGap

  // If the y coordinate of the current node is too close to the y coordinate of the node with the same x coordinate, adjust the y coordinate
  for (let i = 0; i < sameXNodes.length; i++) {
    const node = sameXNodes[i]
    const extraY = Math.abs(node.y - ret)
    if (extraY < TOPOLOGY_BOX_HEIGHT) {
      ret += (heightGap - extraY)
    }
  }

  return ret
}

export const formatLogicFlowData = (rawList = [], rootCoord = {}) => {
  const nodes = []
  const edges = []

  const handlePushNodes = (list, parentId, baseCoord) => {
    list.forEach((item, index) => {
      const currentId = `${item.name}-${item.kind}-${index}`
      const curX = baseCoord.x + TOPOLOGY_BOX_GAP_X
      const currentCoord = parentId
        ? {
            x: curX,
            y: calcCoordY({
              baseY: baseCoord.y,
              curIndex: index,
              curX,
              length: list.length,
              nodes
            })
          }
        : baseCoord

      nodes.push({
        id: currentId,
        text: '',
        type: 'CustomNodeType',
        properties: item,
        ...currentCoord
      })
      if (parentId) {
        edges.push({
          sourceNodeId: parentId,
          targetNodeId: currentId,
          type: 'CustomEdgeType'
        })
      }
      if (item?.leafNodes?.length) {
        handlePushNodes(item.leafNodes, currentId, currentCoord)
      }
    })
  }

  handlePushNodes(rawList, null, rootCoord)

  return {
    nodes,
    edges
  }
}
