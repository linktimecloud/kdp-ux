import { describe, expect, it, beforeEach, vi } from 'vitest'
import * as utils from '@/utils/app'
import i18n from '@/i18n'

describe('test get app status text function', () => {
  it('input undefined return empty string', () => {
    expect(utils.getAppStatusText(undefined)).toBe('')
  })

  it('input empty data return empty string', () => {
    const data = {}
    expect(utils.getAppStatusText(data)).toBe('')
  })

  it('input illegal data return empty string', () => {
    const data = {
      test: 'test'
    }
    expect(utils.getAppStatusText(data)).toBe('')
  })

  it('input data return string', () => {
    const data = {
      status: 'running'
    }
    expect(utils.getAppStatusText(data)).toBe('运行中')
  })

  it('input data return string', () => {
    const data = {
      status: 'running',
      instances: 1
    }
    expect(utils.getAppStatusText(data)).toBe('运行中')
  })

  it('input data return string', () => {
    const data = {
      status: 'running',
      tasks_running: 1
    }
    expect(utils.getAppStatusText(data)).toBe('运行中')
  })

  it('input data return string', () => {
    const data = {
      status: 'running',
      tasks_running: 1,
      instances: 1
    }
    expect(utils.getAppStatusText(data)).toBe('运行中')
  })
})

describe('getAppActionPermisson()', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should return true if this is the current user personal application', () => {
    const mockGetters = { currentUser: { userName: 'koala' } }

    vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => mockGetters }))
    return import('@/utils/app').then(({ getAppActionPermisson }) => {
      expect(getAppActionPermisson('exp', 'u-koala-app')).toBeTruthy()
      expect(getAppActionPermisson('exp', 'exp-u-koala-app')).toBeTruthy()
      expect(getAppActionPermisson('exp', 'koala-app')).toBeFalsy()
    })
  })

  it('should return true if the user is an admin', () => {
    const gname = 'Group Name'
    const mockGetters = { isAdmin: true, currentUser: { groups: [{ name: gname }] } }

    vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => mockGetters }))
    return import('@/utils/app').then(({ getAppActionPermisson }) => {
      expect(getAppActionPermisson(gname)).toBeTruthy()
    })
  })

  it('should return true if the user has either role with id 1 or 9 in their group', () => {
    const gname = 'Group Name'
    const roles = [{ id: '1' }, { id: '3' }]
    const mockGetters = { isAdmin: false, currentUser: { groups: [{ name: gname, roles }] } }

    vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => mockGetters }))
    return import('@/utils/app').then(({ getAppActionPermisson }) => {
      expect(getAppActionPermisson(gname)).toBeTruthy()
    })
  })

  it('should return false if the user is a not admin and does not have the specified roles', () => {
    const gname = 'Group Name'
    const roles = [{ id: '2' }, { id: '3'}]
    const mockGetters = { isAdmin: false, currentUser: { groups: [{ name: gname, roles }] } }

    vi.doMock('@/stores/modules/global', () => ({ useGlobalStore: () => mockGetters }))
    return import('@/utils/app').then(({ getAppActionPermisson }) => {
      expect(getAppActionPermisson(gname)).toBeFalsy()
    })
  })
})

const commonCapacityData = {
  cpuUsed: 20,
  cpuRequest: 30,
  cpuRequestRate: 0.6,
  cpuLimit: 40,
  cpuLimitRate: 0.8,
  memUsed: 1000,
  memRequest: 1500,
  memRequestRate: 0.3,
  memLimit: 2000,
  memLimitRate: 0.4
}

const bdcList = [
  {
    label: 'bdc1',
    isHealth: true,
    status: 'Active'
  },
  {
    label: 'bdc2',
    isHealth: true,
    status: 'Frozen'
  },
  {
    label: 'bdc3',
    isHealth: false,
    status: 'Active'
  }
]

describe('getExportCsvDataFromAppList', () => {
  it('should return an empty array when list and columns are not provided', () => {
    expect(utils.getExportCsvDataFromAppList()).toEqual([])
  })

  it('should return an empty array when list is empty', () => {
    expect(utils.getExportCsvDataFromAppList({ list: [] })).toEqual([])
  })

  it('when the type is pod, should return an array of objects with correct keys and values', () => {
    const core = i18n.t('applications.core')
    const podList = [
      {
        name: 'pod-1',
        status: 'Running',
        containerStatuses: [{ name: 'container-1' }, { name: 'container-2' }],
        ...commonCapacityData
      },
      {
        name: 'pod-2',
        status: 'aaaaa',
        containerStatuses: [{ name: 'container-1' }],
        ...commonCapacityData,
        bdc: 'bdc1'
      }
    ]

    const columns = [
      { prop: 'name', label: 'Name' },
      { prop: 'cpu', label: 'CPU' },
      { prop: 'memory', label: 'Memory' },
      { prop: 'status', label: 'Status' },
      { prop: 'containers', label: 'Containers' },
      { prop: 'bdc', label: 'Bdc' }
    ]
    expect(utils.getExportCsvDataFromAppList({ list: podList, columns, type: 'pod', bdcList })).toEqual([
      {
        Name: 'pod-1',
        CPU: `20${core}  / 30${core} (60%) / 40${core} (80%)`,
        Memory: '1,000 Byte  / 1.46 KiB (30%) / 1.95 KiB (40%)',
        Status: i18n.t('applications.podStatusLabel.Running'),
        Containers: 'container-1,container-2',
        Bdc: i18n.t('common.noData')
      },
      {
        Name: 'pod-2',
        CPU: `20${core}  / 30${core} (60%) / 40${core} (80%)`,
        Memory: '1,000 Byte  / 1.46 KiB (30%) / 1.95 KiB (40%)',
        Status: i18n.t('cluster.unknown'),
        Containers: 'container-1',
        Bdc: `bdc1(${i18n.t('cluster.bdcStatus.active')})`
      }
    ])
  })

  it('when the type is workload, should return an array of objects with correct keys and values', () => {
    const core = i18n.t('applications.core')
    const list = [
      {
        name: 'workload-1',
        status: 'normal',
        pods: '1/2',
        ...commonCapacityData
      },
      {
        name: 'workload-2',
        status: 'aaaaa',
        pods: '5/6',
        ...commonCapacityData,
        bdc: 'bdc2'
      }
    ]

    const columns = [
      { prop: 'name', label: 'Name' },
      { prop: 'cpu', label: 'CPU' },
      { prop: 'memory', label: 'Memory' },
      { prop: 'status', label: 'Status' },
      { prop: 'podsSort', label: 'PodsSort' },
      { prop: 'bdc', label: 'Bdc' }
    ]
    expect(utils.getExportCsvDataFromAppList({ list, columns, type: 'workload', bdcList })).toEqual([
      {
        Name: 'workload-1',
        CPU: `20${core}  / 30${core} (60%) / 40${core} (80%)`,
        Memory: '1,000 Byte  / 1.46 KiB (30%) / 1.95 KiB (40%)',
        Status: i18n.t('applications.runtimeStatus.normal'),
        PodsSort: '1/2',
        Bdc: i18n.t('common.noData')
      },
      {
        Name: 'workload-2',
        CPU: `20${core}  / 30${core} (60%) / 40${core} (80%)`,
        Memory: '1,000 Byte  / 1.46 KiB (30%) / 1.95 KiB (40%)',
        Status: i18n.t('cluster.unknown'),
        PodsSort: '5/6',
        Bdc: `bdc2(${i18n.t('cluster.bdcStatus.frozen')})`
      }
    ])
  })

  it('when the type is application, should return an array of objects with correct keys and values', () => {
    const list = [
      {
        name: 'application-1',
        status: 'executing',
        bdc: 'bdc1',
        containerStatuses: [{ name: 'container-1' }, { name: 'container-2' }],
        updateTime: ''
      },
      {
        name: 'application-2',
        status: 'aaaaa',
        bdc: 'bdc3',
        containerStatuses: [],
        updateTime: ''
      }
    ]

    const columns = [
      { prop: 'name', label: 'Name' },
      { prop: 'status', label: 'Status' },
      { prop: 'bdc', label: 'Bdc' },
      { prop: 'containers', label: 'Containers' },
      { prop: 'updateTime', label: 'UpdateTime' }
    ]
    expect(utils.getExportCsvDataFromAppList({ list, columns, bdcList, type: 'application' })).toEqual([
      {
        Name: 'application-1',
        Status: i18n.t('applications.systemApps.executing'),
        Bdc: `bdc1(${i18n.t('cluster.bdcStatus.active')})`,
        Containers: 'container-1,container-2',
        UpdateTime: i18n.t('common.noData')
      },
      {
        Name: 'application-2',
        Status: i18n.t('cluster.unknown'),
        Bdc: `bdc3(${i18n.t('cluster.bdcStatus.inActive')})`,
        Containers: i18n.t('common.noData'),
        UpdateTime: i18n.t('common.noData')
      }
    ])
  })
})

const enabledFlag = {
  ingress_enabled: false,
  monitor_enabled: false
}

describe('formatAppSetting', () => {
  // Test case 1
  it('should return an empty object when no settings are provided', () => {
    const formattedData = utils.formatAppSetting()
    expect(formattedData).toEqual({ ...enabledFlag })
  })

  // Test case 2
  it('when settings do not contain app-cpus and app-instances', () => {
    const inputData = {
      name: 'my-app'
    }
    const formattedData = utils.formatAppSetting(inputData)
    expect(formattedData).toEqual({ ...inputData, ...enabledFlag })
  })

  // Test case 3
  it('when settings contain both app-cpus and app-instances', () => {
    const inputData = {
      'app-cpus': 3.141592,
      'app-instances': '5'
    }
    const expectedOutput = {
      'app-cpus': 3.142,
      'app-instances': 5
    }
    const formattedData = utils.formatAppSetting(inputData)

    expect(formattedData).toEqual({ ...expectedOutput, ...enabledFlag })
  })

  // Test case 4
  it('when the value of app-cpus is in string format', () => {
    const inputData = {
      'app-cpus': '3.141592'
    }
    const expectedOutput = {
      'app-cpus': 3.142
    }
    const formattedData = utils.formatAppSetting(inputData)

    expect(formattedData).toEqual({ ...expectedOutput, ...enabledFlag })
  })

  it('when the value of app-cups contains more than 3 decimal places', () => {
    const inputData = {
      'app-cpus': 22 / 7
    }
    const expectedOutput = {
      'app-cpus': 3.143
    }
    const formattedData = utils.formatAppSetting(inputData)
    expect(formattedData).toEqual({ ...expectedOutput, ...enabledFlag })
  })

  // Test case 5
  it('when the value of app-instances is in string format', () => {
    const inputData = {
      'app-instances': '8'
    }
    const expectedOutput = {
      'app-instances': 8
    }
    const formattedData = utils.formatAppSetting(inputData)

    expect(formattedData).toEqual({ ...expectedOutput, ...enabledFlag })
  })

  it('If there is one load-balance that is true, then ingress_enabled is true', () => {
    const inputData = {
      ports: [
        { containerPort: '8080', 'load-balance': true },
        { containerPort: '8081', 'load-balance': false }
      ]
    }
    const formattedData = utils.formatAppSetting(inputData)
    expect(formattedData).toEqual({ ...inputData, ingress_enabled: true, monitor_enabled: false })
  })

  it('If there is one is-monitoring that is true, then monitor_enabled is true', () => {
    const inputData = {
      ports: [
        { containerPort: '8080', 'is-monitoring': true },
        { containerPort: '8081', 'is-monitoring': false }
      ]
    }
    const formattedData = utils.formatAppSetting(inputData)
    expect(formattedData).toEqual({ ...inputData, ingress_enabled: false, monitor_enabled: true })
  })

  it('If there are empty values here, they will be removed', () => {
    const inputData = {
      ports: [
        { containerPort: '8080', 'is-monitoring': true },
        { 'is-monitoring': false }
      ],
      volumes: [
        { containerPath: '/test', diskSize: 1 },
        { containerPath: '', diskSize: 1 }
      ],
      env: [
        { key: 'TEST', value: 'test' },
        { key: '', value: 'test' }
      ],
      labels: [
        { key: 'TEST', value: 'test' },
        { key: '', value: 'test' }
      ]
    }
    const outputData = {
      ports: [
        { containerPort: '8080', 'is-monitoring': true }
      ],
      volumes: [
        { containerPath: '/test', diskSize: 1 }
      ],
      env: [
        { key: 'TEST', value: 'test' }
      ],
      labels: [
        { key: 'TEST', value: 'test' }
      ]
    }
    const formattedData = utils.formatAppSetting(inputData)
    expect(formattedData).toEqual({ ...outputData, ingress_enabled: false, monitor_enabled: true })
  })
})
