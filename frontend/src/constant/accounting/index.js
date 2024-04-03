import i18n from '@/i18n'

export const RESOURCE_LIST_DEFAULT_FILTER = () => ({
  entityType: '',
  source: '',
  eventTag: '',
  startTime: '',
  endTime: '',
  orgName: '',
  userName: '',
  entityName: '',
  entityId: '',
  users: [],
  orgs: '', // AS-2.0 暂不支持机构多选
  onlyMe: false,
  orderBy: 'runTime',
  order: 'desc',
  saveFilter: false,
  statisticalDimension: ['orgId']
})

export const DEFAULT_RESOURCE_BREADCRUMB = () => ([
  {
    entityName: 'menu.resourcestatistics',
    entityId: 'home',
    entityType: ''
  }
])

export const DEFAULT_UNIT_OPTION = () => ([
  {
    name: 'MB',
    label: 'MB',
    value: 1
  },
  {
    name: 'GB',
    label: 'GB',
    value: 1024
  },
  {
    name: 'TB',
    label: 'TB',
    value: 1024 * 1024
  }
])

export const DEFAULT_STATISTICS_OBJECT = () => ([
  {
    name: 'cpuCoreWithUnit',
    label: 'cpu',
    color: '#7092ff',
    unit: 'CORE',
    unitAllowChange: false,
    time: 'Days',
    timeAllowChange: true
  },
  {
    name: 'diskWithUnit',
    label: 'disk',
    color: '#5ed8b2',
    unit: 'MB',
    unitAllowChange: true,
    time: 'Days',
    timeAllowChange: true
  },
  {
    name: 'memWithUnit',
    label: 'memory',
    color: '#f9c258',
    unit: 'MB',
    unitAllowChange: true,
    time: 'Days',
    timeAllowChange: true
  }
])

export const DEFAULT_DIMENSION_LIST = () => ([
  {
    name: i18n.t('common.orgName'),
    value: 'orgId',
    disabled: true
  }, {
    name: i18n.t('common.user'),
    value: 'userName'
  }, {
    name: i18n.t('accounting.entityType'),
    value: 'entityType'
  }
])

export const DEFAULT_STATISTICS_UNIT_FORM = () => ({
  time: 'Hours',
  cpu: i18n.t('applications.core'),
  mem: 'MB',
  disk: 'MB'
})

export const STATISTICS_PARAMS_MAP = () => ([
  {
    valueKey: 'time',
    labelKey: 'runTime',
    params: 'runTimes',
    timeUnit: false,
    parseValue: true
  },
  {
    valueKey: 'cpu',
    labelKey: 'cpu',
    params: 'cpuCoreWithUnit',
    timeUnit: true,
    parseValue: true
  },
  {
    valueKey: 'mem',
    labelKey: 'memory',
    params: 'memWithUnit',
    timeUnit: true,
    parseValue: true
  },
  {
    valueKey: 'disk',
    labelKey: 'disk',
    params: 'diskWithUnit',
    timeUnit: true,
    parseValue: true
  },
  {
    labelKey: 'avgCpu',
    params: 'avgCpu',
    timeUnit: false,
    parseValue: false,
    defaultUnit: i18n.t('applications.core')
  },
  {
    labelKey: 'avgMemeory',
    params: 'avgMemeory',
    timeUnit: false,
    parseValue: false,
    defaultUnit: 'MB'
  },
  {
    labelKey: 'avgDisk',
    params: 'avgDisk',
    timeUnit: false,
    parseValue: false,
    defaultUnit: 'MB'
  }
])

export const ACCOUNTING_LIST_COLUMN = () => ([
  {
    prop: 'cal_start_time',
    label: i18n.t('accounting.calStartTime'),
    show: true,
    value: 'calStartTime',
    width: '180px',
    sortable: 'custom',
    isTime: true,
    tip: i18n.t('accounting.tip.calStartTime')
  },
  {
    prop: 'cal_end_time',
    label: i18n.t('accounting.calEndTime'),
    show: true,
    value: 'calEndTime',
    width: '180px',
    sortable: 'custom',
    isTime: true,
    tip: i18n.t('accounting.tip.calEndTime')
  },
  {
    prop: 'runTime',
    label: i18n.t('accounting.runTime'),
    show: true,
    value: 'runTime',
    align: 'right',
    minWidth: '140px',
    sortable: 'custom',
    className: 'custom-column'
  },
  {
    prop: 'cpu',
    label: i18n.t('accounting.cpu'),
    show: true,
    value: 'cpu',
    minWidth: '215px',
    align: 'right',
    sortable: 'custom',
    className: 'custom-column',
    isQuota: true,
    valueKey: 'cpu',
    tip: i18n.t('accounting.tip.cpu')
  },
  {
    prop: 'memory',
    label: i18n.t('accounting.memory'),
    show: true,
    value: 'mem',
    minWidth: '245px',
    align: 'right',
    sortable: 'custom',
    className: 'custom-column',
    isQuota: true,
    valueKey: 'memory',
    tip: i18n.t('accounting.tip.mem')
  },
  {
    prop: 'disk',
    label: i18n.t('accounting.disk'),
    show: true,
    value: 'disk',
    minWidth: '200px',
    align: 'right',
    sortable: 'custom',
    className: 'custom-column',
    isQuota: true,
    valueKey: 'disk',
    tip: i18n.t('accounting.tip.disk')
  },
  {
    prop: 'avgCpu',
    label: i18n.t('accounting.avgCpu'),
    show: true,
    value: 'avgCpu',
    minWidth: '125px',
    align: 'right',
    isDetail: true,
    isAvgQuota: true,
    defaultUnit: i18n.t('applications.core'),
    valueKey: 'avgCpu',
    tip: i18n.t('accounting.tip.avgCpu')
  },
  {
    prop: 'avgMem',
    label: i18n.t('accounting.avgMemeory'),
    show: true,
    value: 'avgMem',
    minWidth: '145px',
    align: 'right',
    isDetail: true,
    isAvgQuota: true,
    defaultUnit: 'MB',
    valueKey: 'avgMemeory',
    tip: i18n.t('accounting.tip.avgMem')
  },
  {
    prop: 'avgDisk',
    label: i18n.t('accounting.avgDisk'),
    show: true,
    value: 'avgDisk',
    minWidth: '130px',
    align: 'right',
    isDetail: true,
    isAvgQuota: true,
    defaultUnit: 'MB',
    valueKey: 'avgDisk',
    tip: i18n.t('accounting.tip.avgDisk')
  }
])
