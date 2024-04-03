import i18n from '@/i18n'
import { GREEN_COLOR, GRAY_COLOR, WARNING_COLOR, DANGER_COLOR } from '@/constant/color'

export const DEFAULT_NODES_LABELS = () => ([
  {
    keyValue: 'hdfs-namenode-selector:hdfs-namenode',
    key: 'hdfs-namenode-selector',
    value: 'hdfs-namenode'
  }, {
    keyValue: 'hdfs-datanode-selector:hdfs-datanode',
    key: 'hdfs-datanode-selector',
    value: 'hdfs-datanode'
  }
])

export const DEFAULT_SORTS_LABELS = () => ([
  {
    label: i18n.t('common.nodeType'),
    key: 'typeSort'
  },
  {
    label: i18n.t('common.tasks'),
    key: 'pod_number'
  },
  {
    label: i18n.t('common.allocatableCpuTotal'),
    key: 'cpuAllocatableTotal'
  },
  {
    label: i18n.t('common.allocatableMemTotal'),
    key: 'memAllocatableTotal'
  },
  {
    label: i18n.t('common.usedCPURate'),
    key: 'cpuUsedRate'
  },
  {
    label: i18n.t('common.requestsCPURate'),
    key: 'cpuRequestRate'
  },
  {
    label: i18n.t('common.limitsCPURate'),
    key: 'cpuLimitRate'
  },
  {
    label: i18n.t('common.usedMemRate'),
    key: 'memUsedRate'
  },
  {
    label: i18n.t('common.requestMemRate'),
    key: 'memRequestRate'
  },
  {
    label: i18n.t('common.limitsMemRate'),
    key: 'memLimitRate'
  }
])

export const DEFAULT_NODES_FILTER = () => ({
  name: '',
  type: '',
  labels: [],
  sort: 'typeSort'
})

export const RESOURCE_DASHBOARDS = () => ([
  {
    name: 'node_resource',
    label: i18n.t('cluster.dashboard.nodeResource'),
    height: '420px'
  },
  {
    name: 'group_resource',
    label: i18n.t('cluster.dashboard.groupResource'),
    height: '420px'
  },
  {
    name: 'container_resource',
    label: i18n.t('cluster.dashboard.containerResource'),
    labelTips: 'DASHBOARD_CONTAINER_RESOURCE',
    height: '420px'
  }
])

export const SHOW_INFOICON_STATUS_ARR = () => ([
  {
    NetworkUnavailable: 'False'
  },
  {
    MemoryPressure: 'False'
  },
  {
    DiskPressure: 'False'
  },
  {
    PIDPressure: 'False'
  },
  {
    Ready: 'True'
  },
  {
    SchedulingDisabled: 'False'
  }
])

export const MASTER_NODES_TYPE = 'control-plane'

export const NODE_INFO_KEYS = ['operating_system', 'os_image', 'kernel_version', 'container_runtime_version']

export const BIG_DATA_CLUSTER_STATUS = () => ([
  {
    value: 'Disabled',
    label: i18n.t('cluster.bdcStatus.disabled'),
    color: WARNING_COLOR
  },
  {
    value: 'Frozen',
    label: i18n.t('cluster.bdcStatus.frozen'),
    color: WARNING_COLOR
  },
  {
    value: 'Active',
    label: i18n.t('cluster.bdcStatus.active'),
    color: GREEN_COLOR
  },
  {
    value: 'InActive',
    label: i18n.t('cluster.bdcStatus.inActive'),
    color: GRAY_COLOR
  },
  {
    value: 'Terminating',
    label: i18n.t('cluster.bdcStatus.terminating'),
    color: DANGER_COLOR
  }
])
