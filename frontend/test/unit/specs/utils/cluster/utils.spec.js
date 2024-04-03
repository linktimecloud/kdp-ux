import i18n from '@/i18n'

import {
  getNodesStatusValueObj,
  getNodesResourceColor,
  getNodesLabelValid,
  formatCapacityValue,
  getUsedRequestLimitText,
  getStatusText,
  getExportCsvDataFromNodeList,
  getPrimaryValue,
  formatPrometheusTableData,
  getBdcStatusTip,
  getBdcOptions
} from '@/utils/cluster/utils.js'

import {
  GREEN_COLOR,
  QUOTA_GRAY,
  DANGER_COLOR,
  INFO_COLOR,
  WARNING_COLOR
} from '@/constant/color'

const commonCapacityData = {
  cpuUsed: 20,
  cpuUsedRate: 0.4,
  cpuRequest: 30,
  cpuRequestRate: 0.6,
  cpuLimit: 40,
  cpuLimitRate: 0.8,
  memUsed: 1000,
  memUsedRate: 0.2,
  memRequest: 1500,
  memRequestRate: 0.3,
  memLimit: 2000,
  memLimitRate: 0.4
}

describe('test getNodesStatusValueObj function', () => {
  test('if key is Ready', () => {
    const key = 'Ready'
    expect(getNodesStatusValueObj(key, 'True')).toEqual({
      valueText: i18n.t('cluster.nodeHealth'),
      color: GREEN_COLOR
    })
    expect(getNodesStatusValueObj(key, 'False')).toEqual({
      valueText: i18n.t('cluster.nodeUnhealth'),
      color: DANGER_COLOR
    })
    expect(getNodesStatusValueObj(key, '')).toEqual({
      valueText: i18n.t('cluster.unknown'),
      color: QUOTA_GRAY
    })
  })

  test('if key is NetworkUnavailable', () => {
    const key = 'NetworkUnavailable'
    expect(getNodesStatusValueObj(key, 'True')).toEqual({
      valueText: i18n.t('cluster.false'),
      color: DANGER_COLOR
    })
    expect(getNodesStatusValueObj(key, 'False')).toEqual({
      valueText: i18n.t('cluster.true'),
      color: GREEN_COLOR
    })
    expect(getNodesStatusValueObj(key, '')).toEqual({
      valueText: i18n.t('cluster.unknown'),
      color: QUOTA_GRAY
    })
  })

  test('if key is SchedulingDisabled', () => {
    const key = 'SchedulingDisabled'
    expect(getNodesStatusValueObj(key, 'True')).toEqual({
      valueText: i18n.t('common.stop'),
      color: QUOTA_GRAY
    })
    expect(getNodesStatusValueObj(key, 'False')).toEqual({
      valueText: i18n.t('common.on'),
      color: GREEN_COLOR
    })
    expect(getNodesStatusValueObj(key, '')).toEqual({
      valueText: i18n.t('cluster.unknown'),
      color: QUOTA_GRAY
    })
  })

  test('if key is Pressure', () => {
    const key = 'MemoryPressure'
    expect(getNodesStatusValueObj(key, 'True')).toEqual({
      valueText: i18n.t('cluster.large'),
      color: DANGER_COLOR
    })
    expect(getNodesStatusValueObj(key, 'False')).toEqual({
      valueText: i18n.t('cluster.small'),
      color: GREEN_COLOR
    })
    expect(getNodesStatusValueObj(key, '')).toEqual({
      valueText: i18n.t('cluster.unknown'),
      color: QUOTA_GRAY
    })
  })
})

describe('test getNodesResourceColor function', () => {
  test('if type is cpu', () => {
    expect(getNodesResourceColor('cpu')).toBe(INFO_COLOR)
  })
  test('if type is mem', () => {
    expect(getNodesResourceColor('mem')).toBe(GREEN_COLOR)
  })
  test('if type is disk', () => {
    expect(getNodesResourceColor('disk')).toBe(WARNING_COLOR)
  })
  test('if type is default', () => {
    expect(getNodesResourceColor()).toBe(QUOTA_GRAY)
  })
})

describe('test getNodesLabelValid function', () => {
  test('if labelKey is not uniq', () => {
    const data = {
      type: 'key',
      item: { key: '111' },
      isUniqKey: false
    }
    expect(getNodesLabelValid(data)).toBe(i18n.t('cluster.labelNotUniq'))
  })

  test('if labelKey is invalid', () => {
    const data = {
      type: 'key',
      item: { key: 'aa/aa.' },
      isUniqKey: true
    }
    expect(getNodesLabelValid(data)).toBe(`${i18n.t('cluster.labelKey')}${i18n.t('cluster.inValid')}`)

    const data2 = {
      type: 'key',
      item: { key: 'aa/aa/a' },
      isUniqKey: true,
      sign: 'bdc'
    }
    expect(getNodesLabelValid(data2)).toBe(`${i18n.t('cluster.labelKey')}${i18n.t('cluster.inValid')}`)
  })

  test('if labelKey is empty', () => {
    const data = {
      type: 'key',
      item: { key: '', value: 'aaa' },
      isUniqKey: true
    }
    expect(getNodesLabelValid(data)).toBe(`${i18n.t('cluster.labelKey')}${i18n.t('pass.noEmpty')}`)
  })

  test('if labelValue is invalid', () => {
    const data = {
      type: 'value',
      item: { key: 'test', value: 'aaa/aaa' },
      isUniqKey: true
    }
    expect(getNodesLabelValid(data)).toBe(`${i18n.t('cluster.labelValue')}${i18n.t('cluster.inValid')}`)
  })
})

describe('formatCapacityValue', () => {
  it('should return 0 if the value is 0 or negative', () => {
    expect(formatCapacityValue('cpu', 0)).toBe(0)
    expect(formatCapacityValue('disk', -1)).toBe(0)
  })

  it('should return a formatted string for CPU type', () => {
    expect(formatCapacityValue('cpu', 1.235)).toBe('1.23核')
    expect(formatCapacityValue('cpu', 1234.567)).toBe('1234.56核')
    expect(formatCapacityValue('cpu', 0.000012344)).toBe('0.000012核')
  })

  it('should return a formatted string for non-CPU type', () => {
    expect(formatCapacityValue('mem', 123456789)).toBe('117.74 MiB')
    expect(formatCapacityValue('disk', 123456789)).toBe('117.74 MiB')
  })

  it('should return `-` if the status is notRunning', () => {
    expect(formatCapacityValue('cpu', undefined, 'notRunning')).toBe('-')
  })
})

describe('getUsedRequestLimitText', () => {
  const item = {
    ...commonCapacityData
  }

  test('should return formatted text for CPU usage, request and limit', () => {
    const keys = ['cpuUsed', 'cpuRequest', 'cpuLimit']
    const result = getUsedRequestLimitText(item, keys, 'cpu')
    const core = i18n.t('applications.core')
    expect(result).toBe(`20${core} (40%) / 30${core} (60%) / 40${core} (80%)`)
  })

  test('should return formatted text for memory usage, request and limit', () => {
    const keys = ['memUsed', 'memRequest', 'memLimit']
    const result = getUsedRequestLimitText(item, keys, 'mem')
    expect(result).toBe('1,000 Byte (20%) / 1.46 KiB (30%) / 1.95 KiB (40%)')
  })

  test('should return empty string if keys are empty', () => {
    const keys = []
    const result = getUsedRequestLimitText(item, keys, 'cpu')
    expect(result).toBe('')
  })
})

describe('getStatusText', () => {
  test('returns correct text for a master node', () => {
    const item = {
      type: ['control-plane'],
      status: [
        { Ready: 'True' },
        { PIDPressure: 'False' }
      ]
    }
    expect(getStatusText(item)).toBe(`${i18n.t('cluster.masterNode')}: ${i18n.t('cluster.Ready')}: ${i18n.t('cluster.nodeHealth')} ; ${i18n.t('cluster.PIDPressure')}: ${i18n.t('cluster.small')}`)
  })

  test('returns correct text for a worker node', () => {
    const item = {
      type: ['worker'],
      status: [
        { Ready: 'True' },
        { PIDPressure: 'False' }
      ]
    }
    expect(getStatusText(item)).toBe(`${i18n.t('cluster.workerNode')}: ${i18n.t('cluster.Ready')}: ${i18n.t('cluster.nodeHealth')} ; ${i18n.t('cluster.PIDPressure')}: ${i18n.t('cluster.small')}`)
  })

  test('returns correct text when there is no status', () => {
    expect(getStatusText({
      type: ['control-plane'],
      status: []
    })).toBe(`${i18n.t('cluster.masterNode')}: `)

    expect(getStatusText({
      type: ['control-plane']
    })).toBe(`${i18n.t('cluster.masterNode')}: `)
  })
})

const list = [
  {
    name: 'agent1',
    ip: '172.10.1.158',
    koala: '哈哈哈',
    type: ['worker'],
    labels: { koala: '123' },
    pod_nuMiBer: 45,
    status: [{ Ready: 'True' }, { PIDPressure: 'False'}],
    capacity_usage: {
      capacity_cpu_total: 16,
      capacity_mem_total: 33565421568,
      capacity_storage_total: 83497164800
    },
    typeSort: 'worker',
    capacityCpuTotalSort: 16,
    capacityMemTotalSort: 33565421568,
    diskSort: 83497164800,
    cpuAllocatableTotal: 15.6,
    memAllocatableTotal: 31362862465,
    ...commonCapacityData
  },
  {
    name: 'agent10',
    ip: '172.10.1.184',
    koala: '啦啦啦',
    publicIp: '',
    type: ['worker'],
    labels: { isIngress: 'true' },
    pod_nuMiBer: 50,
    status: [{ Ready: 'True' }, { PIDPressure: 'False'}],
    capacity_usage: {
      capacity_cpu_total: 12,
      capacity_mem_total: 25110069248,
      capacity_storage_total: 83497164800
    },
    typeSort: 'worker',
    capacityCpuTotalSort: 12,
    capacityMemTotalSort: 25110069248,
    diskSort: 83497164800,
    cpuAllocatableTotal: 11.6,
    memAllocatableTotal: 23330277767,
    ...commonCapacityData
  }
]

const columns = [
  { prop: 'name', label: 'name'},
  { prop: 'koala', label: '考拉'},
  { prop: 'typeSort', label: 'type/status', downloadKey: 'type'},
  { prop: 'labels', label: 'labels'},
  { prop: 'settings', label: 'settings'},
  { prop: 'allocatable', label: 'allocatable'},
  { prop: 'cpuSort', label: 'cpuSort-111'},
  { prop: 'memSort', label: 'memSort-222'},
  { prop: 'diskSort', label: 'diskSort-333'},
  { prop: 'operate', label: '操作'}
]

describe('getExportCsvDataFromNodeList', () => {
  test('returns empty string for empty NodeList', () => {
    expect(getExportCsvDataFromNodeList()).toEqual([])
  })

  test('returns correct CSV data from valid NodeList', () => {
    const result = getExportCsvDataFromNodeList({ list, columns })
    const statusText = `${i18n.t('cluster.workerNode')}: ${i18n.t('cluster.Ready')}: ${i18n.t('cluster.nodeHealth')} ; ${i18n.t('cluster.PIDPressure')}: ${i18n.t('cluster.small')}`
    const core = i18n.t(' applications.core')

    expect(result).toEqual([
      {
        allocatable: `15.6${core} / 29.21 GiB`,
        'cpuSort-111': `20${core} (40%) / 30${core} (60%) / 40${core} (80%)`,
        'diskSort-333': '77.76 GiB',
        labels: 'koala:123',
        'memSort-222': '1,000 Byte (20%) / 1.46 KiB (30%) / 1.95 KiB (40%)',
        name: 'agent1(172.10.1.158)',
        settings: `16${core} / 31.26 GiB`,
        'type/status': statusText,
        考拉: '哈哈哈'
      },
      {
        allocatable: `11.6${core} / 21.73 GiB`,
        'cpuSort-111': `20${core} (40%) / 30${core} (60%) / 40${core} (80%)`,
        'diskSort-333': '77.76 GiB',
        labels: 'isIngress:true',
        'memSort-222': '1,000 Byte (20%) / 1.46 KiB (30%) / 1.95 KiB (40%)',
        name: 'agent10(172.10.1.184)',
        settings: `12${core} / 23.39 GiB`,
        'type/status': statusText,
        考拉: '啦啦啦'
      }
    ])
  })
})

describe('getPrimaryValue', () => {
  it('should return correct primary value', () => {
    const columns = [
      { key: 'id', label: 'ID', primary: true },
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age', primary: true },
      { key: 'gender', label: 'Gender' }
    ]

    const itemData = { id: 123, name: 'John', age: 30, gender: 'Male' }
    const primaryValue = getPrimaryValue({ columns, itemData })
    expect(primaryValue).toBe('123_30')
  })

  it('should return empty string when no primary column is found', () => {
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' }
    ]
    const itemData = { name: 'John', age: 30, gender: 'Male' }
    const primaryValue = getPrimaryValue({ columns, itemData })
    expect(primaryValue).toBe('')
  })

  it('should return empty string when itemData is undefined', () => {
    const primaryValue = getPrimaryValue()
    expect(primaryValue).toBe('')
  })
})

describe('formatPrometheusTableData', () => {
  it('check default value', () => {
    expect(formatPrometheusTableData()).toEqual({})
  })

  it('should format the Prometheus table data correctly', () => {
    const dataResults = [
      {
        refId: 'A',
        result: [
          {
            metric: {
              node: 'value1'
            },
            value: [123, '4']
          },
          {
            metric: {
              node: 'value2.a.b'
            },
            value: [456, '7']
          }
        ]
      },
      {
        refId: 'B',
        result: [
          {
            metric: {
              node: 'value1'
            },
            value: [789, '10']
          }
        ]
      }
    ]

    const columns = [
      { key: 'node', primary: true },
      { key: 'label1', layout: 'progressBar' },
      { key: 'label2', format: 'percent' },
      { key: 'B', dependPrimary: 'label1' }
    ]

    expect(formatPrometheusTableData({ dataResults, columns })).toEqual({
      value1: {
        A: 4,
        B: 10,
        node: 'value1'
      },
      'value2.a.b': {
        A: 7,
        node: 'value2.a.b'
      }
    })
  })
})

describe('getBdcStatusTip', () => {
  it('should return status tip for bdcUnHealthyTip sign when isHealth is false', () => {
    const output = getBdcStatusTip({
      sign: 'bdcUnHealthyTip',
      isHealth: false,
      statusText: 'testStatus'
    })

    expect(output).toBe(i18n.t('cluster.bdcUnHealthyTip'))
  })

  it('should return status tip for non-bdcUnHealthyTip sign when isHealth is false or status is not Active', () => {
    const output = getBdcStatusTip({
      sign: 'appBdcNotReadyTip',
      isHealth: false,
      statusText: 'testStatus'
    })

    expect(output).toBe(i18n.t('cluster.appBdcNotReadyTip', { status: 'testStatus' }))
  })

  it('should return empty string for inactive and healthy condition', () => {
    const output = getBdcStatusTip({
      sign: 'workflow',
      isHealth: true,
      status: 'Active',
      statusText: 'testStatus'
    })

    expect(output).toBe('')
  })
})

describe('getBdcOptions', () => {
  it('should return a list with a default option and ordered, filtered items', () => {
    const bdcList = [
      { label: 'Label 1', value: 2, org: 'Group A' },
      { label: 'Label 3', value: 1, org: 'Group B' },
      { label: 'Label 2', value: 3, org: 'Group A' }
    ]

    // i18n.t函数就直接返回输入的字符串
    i18n.t = jest.fn((str) => str)

    const result = getBdcOptions(bdcList, 'Group A')

    expect(result).toEqual([
      { label: 'common.all', value: '' },
      { label: 'Label 1', value: 2, org: 'Group A' },
      { label: 'Label 2', value: 3, org: 'Group A' }
    ])
  })

  it('should return a list with a default option', () => {
    const bdcList = []

    i18n.t = jest.fn((str) => str)

    const result = getBdcOptions(bdcList, 'Group A')

    expect(result).toEqual([
      { label: 'common.all', value: '' }
    ])
  })
})
