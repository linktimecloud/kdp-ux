import { rawToDataResults } from '@/common/dashboard/panelCard/utils'

describe('test rawToDataResults, it is a function takes raw dashboard data, turn into the format for the  chartComponent in panelCard', () => {
  describe('rawToDataResults default', () => {
    test('rawToDataResults default ', () => {
      const rspData = {
        COUNT: {
          refId: 'COUNT',
          data: {
            result: [
              { metric: {}, values: [1666836211.237, '208'] },
              { metric: {}, values: [1666840531.237, '100'] }
            ]
          }
        }
      }

      const targets = [
        {
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          raw: true,
          refId: 'COUNT'
        }
      ]

      const result = rawToDataResults(rspData, targets)

      expect(Array.isArray(result)).toBe(true)
      // equal to targets.length
      expect(result.length).toBe(1)
      expect(Object.keys(result[0])).toEqual(['target', 'refId', 'data'])
    })
  })

  describe('rawToDataResults POD_LOG_STDOUT_TABLE', () => {
    test('rawToDataResults POD_LOG_STDOUT_TABLE ', () => {
      const rspData = {
        COUNT: {
          data: {
            resultType: 'matrix',
            result: [
              {
                metric: {
                  container: 'bpaas-core',
                  namespace: 'admin',
                  pod: 'bpaas-core-5c755d78b7-8fcm8'
                },
                values: [
                  [1666923030, '100'],
                  [1666923040, '200']
                ]
              },
              {
                metric: {
                  container: 'bpaas-web',
                  namespace: 'admin',
                  pod: 'bpaas-web-5c755d78b7-8fcm8'
                },
                values: [
                  [1666923030, '10'],
                  [1666923040, '20']
                ]
              }
            ]
          },
          refId: 'COUNT'
        },
        DISK: {
          data: {
            resultType: 'matrix',
            result: [
              {
                metric: {
                  container: 'bpaas-core',
                  namespace: 'admin',
                  pod: 'bpaas-core-5c755d78b7-8fcm8'
                },
                values: [
                  [1666923030, '300'],
                  [1666923040, '400']
                ]
              },

              {
                metric: {
                  container: 'bpaas-web',
                  namespace: 'admin',
                  pod: 'bpaas-web-5c755d78b7-8fcm8'
                },
                values: [
                  [1666923030, '30'],
                  [1666923040, '40']
                ]
              }
            ]
          },
          refId: 'DISK'
        }
      }

      const targets = [
        {
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          interval: '',
          raw: true,
          legendFormat: '',
          refId: 'COUNT'
        },
        {
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (bytes_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          interval: '',
          raw: true,
          legendFormat: '',
          refId: 'DISK'
        }
      ]

      const ret = rawToDataResults(rspData, targets, 'POD_LOG_STDOUT_TABLE')

      const shouldRet = [
        {
          target: {
            datasourceType: 'loki',
            expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
            interval: '',
            raw: true,
            legendFormat: '',
            refId: 'COUNT'
          },
          result: [
            {
              metric: {
                container: 'bpaas-core',
                namespace: 'admin',
                pod: 'bpaas-core-5c755d78b7-8fcm8'
              },
              value: [1666923030, 300]
            },
            {
              metric: {
                container: 'bpaas-web',
                namespace: 'admin',
                pod: 'bpaas-web-5c755d78b7-8fcm8'
              },
              value: [1666923030, 30]
            }
          ],
          refId: 'COUNT'
        },
        {
          target: {
            datasourceType: 'loki',
            expr: 'sum by(namespace, container, pod) (bytes_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
            interval: '',
            raw: true,
            legendFormat: '',
            refId: 'DISK'
          },
          result: [
            {
              metric: {
                container: 'bpaas-core',
                namespace: 'admin',
                pod: 'bpaas-core-5c755d78b7-8fcm8'
              },
              value: [1666923030, 700]
            },
            {
              metric: {
                container: 'bpaas-web',
                namespace: 'admin',
                pod: 'bpaas-web-5c755d78b7-8fcm8'
              },
              value: [1666923030, 70]
            }
          ],
          refId: 'DISK'
        }
      ]
      expect(ret).toEqual(shouldRet)
    })
  })

  // POD_LOG_STDOUT_GRAPH 目标： 对每个 target 来说对应 result的长度最多为 1
  describe('rawToDataResults POD_LOG_STDOUT_GRAPH', () => {
    test('rawToDataResults POD_LOG_STDOUT_GRAPH when result is empty ', () => {
      const rspData = {
        COUNT: {
          data: {
            resultType: 'matrix',
            result: []
          },
          refId: 'COUNT'
        }
      }

      const targets = [
        {
          refId: 'COUNT',
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          legendFormat: '条数',
          raw: true,
          chartOptions: {
            type: 'bar',
            symbol: 'none'
          }
        }
      ]

      const ret = rawToDataResults(rspData, targets, 'POD_LOG_STDOUT_GRAPH')

      const shouldRet = [
        {
          target: { ...targets[0] },
          result: [],
          refId: 'COUNT'
        }
      ]
      expect(ret).toEqual(shouldRet)
    })

    test('rawToDataResults POD_LOG_STDOUT_GRAPH when originResult for target  length is  1  ', () => {
      const rspData = {
        COUNT: {
          data: {
            resultType: 'matrix',
            result: [
              {
                metric: {},
                values: [
                  [1666923030, '10'],
                  [1666923040, '20'],
                  [1666923050, '30']
                ]
              }
            ]
          },
          refId: 'COUNT'
        }
      }

      const targets = [
        {
          refId: 'COUNT',
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          legendFormat: '条数',
          raw: true,
          chartOptions: {
            type: 'bar',
            symbol: 'none'
          }
        }
      ]

      const ret = rawToDataResults(rspData, targets, 'POD_LOG_STDOUT_GRAPH')

      const shouldRet = [
        {
          target: { ...targets[0] },
          result: rspData.COUNT.data.result,
          refId: 'COUNT'
        }
      ]
      expect(ret).toEqual(shouldRet)
    })

    test('rawToDataResults POD_LOG_STDOUT_GRAPH when originResult for target  length > 1  ', () => {
      const rspData = {
        COUNT: {
          data: {
            resultType: 'matrix',
            result: [
              {
                metric: {},
                values: [
                  [1666923030, '10'],
                  [1666923040, '20'],
                  [1666923050, '30']
                ]
              },
              {
                metric: {},
                values: [
                  [1666923030, '1'],
                  [1666923040, '2'],
                  [1666923050, '3']
                ]
              }
            ]
          },
          refId: 'COUNT'
        }
      }

      const targets = [
        {
          refId: 'COUNT',
          datasourceType: 'loki',
          expr: 'sum by(namespace, container, pod) (count_over_time({namespace=~"$namespace", container=~"$container", pod=~"$pod"} [$__range]))',
          legendFormat: '条数',
          raw: true,
          chartOptions: {
            type: 'bar',
            symbol: 'none'
          }
        }
      ]

      const ret = rawToDataResults(rspData, targets, 'POD_LOG_STDOUT_GRAPH')

      const shouldRet = [
        {
          target: { ...targets[0] },
          result: [
            {
              metric: {},
              values: [
                [1666923030, 11],
                [1666923040, 22],
                [1666923050, 33]
              ]
            }
          ],
          refId: 'COUNT'
        }
      ]
      expect(ret).toEqual(shouldRet)
    })
  })

  describe('rawToDataResults POD_LOG_FILEERR_LOGS', () => {
    test('rawToDataResults POD_LOG_FILEERR_LOGS ', () => {
      const item1 = {
        labels: {
          a: 'a'
        },
        line: 'content1',
        time: '2022-10-28 10:41:55',
        tsNs: 1666924915167.2463
      }
      const item2 = {
        labels: {
          b: 'b'
        },
        line: 'content2',
        time: '2022-10-28 10:41:56',
        tsNs: 1666924915167.2466
      }
      const rspData = {
        0: {
          0: [{ ...item1 }],
          1: [{ ...item2 }]
        }
      }

      const ret = rawToDataResults(rspData, {}, 'POD_LOG_FILEERR_LOGS')

      const shouldRet = [
        {
          labels: { ...item2.labels },
          content: item2.line,
          createdAt: item2.time
        },
        {
          labels: { ...item1.labels },
          content: item1.line,
          createdAt: item1.time
        }
      ]
      expect(ret).toEqual(shouldRet)
    })
  })

  describe('rawToDataResults POD_LOGVIEWER_STD_LOGS', () => {
    test('rawToDataResults POD_LOGVIEWER_STD_LOGS if empty dashboard data', () => {
      expect(rawToDataResults({ 0: {} }, {}, 'POD_LOGVIEWER_STD_LOGS')).toEqual(
        []
      )
    })

    test('rawToDataResults POD_LOGVIEWER_STD_LOGS if not empty dashboard data ', () => {
      expect(
        rawToDataResults(
          {
            0: {
              0: [{ tsNs: 1000000, line: '000000', labels: { a: 0, b: 0 } }],
              1: [{ tsNs: 1000001, line: '111111', labels: { a: 1, b: 1 } }],
              refId: 'A'
            }
          },
          {},
          'POD_LOGVIEWER_STD_LOGS'
        )
      ).toEqual([
        { createdAt: 1000000, content: '000000', labels: { a: 0, b: 0 } },
        { createdAt: 1000001, content: '111111', labels: { a: 1, b: 1 } }
      ])
    })
  })
})
