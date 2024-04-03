import { formatLogicFlowData } from '@/pages/apps/applications/resourcesTopology/utils.js'

const MOCK_DATA = {
  name: 'koala-test-app',
  kind: 'Application',
  isRoot: true,
  leafNodes: [
    {
      name: 'koala-test',
      kind: 'HelmRelease',
      leafNodes: [
        {
          name: 'koala-test',
          kind: 'Deployment',
          leafNodes: [
            {
              name: 'koala-test-123',
              kind: 'Pod'
            }
          ]
        },
        {
          name: 'koala-test',
          kind: 'Secret'
        }
      ]
    }
  ]
}

describe('pages resourcesTopology utils', () => {
  describe('test formatLogicFlowData funciton', () => {
    it('check default return value', () => {
      expect(formatLogicFlowData()).toEqual({ nodes: [], edges: [] })
    })

    it('check isRoot node value', () => {
      const { nodes } = formatLogicFlowData([{
        name: 'koala-test-app',
        kind: 'Application',
        isRoot: true
      }], { x: 0, y: 0 })
      expect(nodes).toEqual([{
        id: 'koala-test-app-Application-0',
        text: '',
        type: 'CustomNodeType',
        properties: {
          name: 'koala-test-app',
          kind: 'Application',
          isRoot: true
        },
        x: 0,
        y: 0
      }])
    })

    it('check leafNodes value', () => {
      const { nodes } = formatLogicFlowData([MOCK_DATA], { x: 0, y: 0 })
      expect(nodes).toEqual([
        {
          id: 'koala-test-app-Application-0',
          text: '',
          type: 'CustomNodeType',
          properties: MOCK_DATA,
          x: 0,
          y: 0
        },
        {
          id: 'koala-test-HelmRelease-0',
          text: '',
          type: 'CustomNodeType',
          properties: MOCK_DATA.leafNodes[0],
          x: 340,
          y: 0
        },
        {
          id: 'koala-test-Deployment-0',
          text: '',
          type: 'CustomNodeType',
          properties: MOCK_DATA.leafNodes[0].leafNodes[0],
          x: 680,
          y: 0
        },
        {
          id: 'koala-test-123-Pod-0',
          text: '',
          type: 'CustomNodeType',
          properties: MOCK_DATA.leafNodes[0].leafNodes[0].leafNodes[0],
          x: 1020,
          y: 0
        },
        {
          id: 'koala-test-Secret-1',
          text: '',
          type: 'CustomNodeType',
          properties: MOCK_DATA.leafNodes[0].leafNodes[1],
          x: 680,
          y: 130
        }
      ])
    })
  })
})
