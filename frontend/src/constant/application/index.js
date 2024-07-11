import { GREEN_COLOR, GRAY_COLOR, DANGER_COLOR, WARNING_COLOR } from '@/constant/color'
import i18n from '@/i18n'

export const LOAD_BALANCER_TYPE = () => ([
  {
    value: '',
    label: i18n.t('common.all')
  },
  {
    value: 'Deployment',
    label: 'Deployment'
  },
  {
    value: 'StatefulSet',
    label: 'StatefulSet'
  },
  {
    value: 'DaemonSet',
    label: 'DaemonSet'
  },
  {
    value: 'StrimziPodSet',
    label: 'StrimziPodSet'
  }
])

export const LOAD_BALANCER_STATUS = () => ([
  {
    value: '',
    label: i18n.t('common.all')
  },
  {
    value: 'normal',
    label: i18n.t('applications.runtimeStatus.normal'),
    color: GREEN_COLOR
  },
  {
    value: 'abnormal',
    label: i18n.t('applications.runtimeStatus.abnormal'),
    color: DANGER_COLOR
  },
  {
    value: 'notRunning',
    label: i18n.t('applications.runtimeStatus.notRunning'),
    color: GRAY_COLOR
  }
])

export const SYSTEM_APPLICATION_STATUS = () => ([
  {
    value: '',
    label: i18n.t('common.all')
  },
  {
    value: 'exception',
    label: i18n.t('applications.systemApps.exception'),
    color: DANGER_COLOR
  },
  {
    value: 'failed',
    label: i18n.t('applications.systemApps.failed'),
    color: DANGER_COLOR
  },
  {
    value: 'executing',
    label: i18n.t('applications.systemApps.executing'),
    color: WARNING_COLOR
  },
  {
    value: 'running',
    label: i18n.t('applications.systemApps.running'),
    color: GREEN_COLOR
  },
  {
    value: 'stopping',
    label: i18n.t('applications.systemApps.stopping'),
    color: WARNING_COLOR
  },
  {
    value: 'unknown',
    label: i18n.t('applications.systemApps.unknown'),
    color: GRAY_COLOR
  }
])

export const DEFAULT_STATUS_MAP = () => ([
  {
    value: 'running',
    label: i18n.t('status.running'),
    color: GREEN_COLOR
  },
  {
    value: 'runningworkflow',
    label: i18n.t('applications.runningworkflow'),
    color: GRAY_COLOR
  },
  {
    value: 'abnormal',
    label: i18n.t('status.abnormal'),
    color: DANGER_COLOR
  },
  {
    value: 'normal',
    label: i18n.t('status.normal'),
    color: GREEN_COLOR
  },
  {
    value: 'pending',
    label: i18n.t('status.pending'),
    color: WARNING_COLOR
  },
  {
    value: 'succeeded',
    label: i18n.t('status.succeeded'),
    color: GREEN_COLOR
  },
  {
    value: 'failed',
    label: i18n.t('status.failed'),
    color: DANGER_COLOR
  },
  {
    value: 'starting',
    label: i18n.t('status.starting'),
    color: WARNING_COLOR
  },
])

export const CATALOGS_APP_STATUS = () => ([
  {
    value: 'installed',
    label: i18n.t('applications.installed'),
    color: GREEN_COLOR
  },
  {
    value: 'notInstalled',
    label: i18n.t('applications.notInstalled'),
    color: GRAY_COLOR
  }
])

export const CORE_COMPONENT_MAP = () => ({
  systemService: ['operator'],
  bigDataComponent: ['hdfs', 'hive', 'spark', 'kafka', 'flink', 'zookeeper'],
  developmentTools: ['airbyte', 'airflow', 'hue', 'superset'],
  middleware: ['minio', 'mysql', 'clickhouse', 'milvus', 'juicefs']
})

export const POD_STATUS_MAP = ['Running', 'Pending', 'Succeeded', 'Failed', 'Unknown']

export const DEFAULT_OPTIONS = () => ([
  { name: i18n.t('common.all'), value: '.+' }
])

export const APP_CONFIG_INFO_MAP = () => ({
  pod: [
    {
      key: 'catalog',
      label: i18n.t('applications.fromCatalog')
    },
    {
      key: 'appForm',
      label: i18n.t('applications.fromApp')
    },
    {
      key: 'workloadName',
      label: i18n.t('menu.loadbalancer')
    },
    {
      key: 'workloadKind',
      label: i18n.t('applications.loadBalancer.kind')
    },
    {
      key: 'creationTime',
      label: i18n.t('common.createdAt'),
      format: 'time'
    },
    {
      key: 'qosClass',
      label: i18n.t('applications.qosClass'),
      tip: 'QOS_CLASS_TIP'
    },
    {
      key: 'restartNum',
      label: i18n.t('applications.restartNum')
    },
    {
      key: 'status',
      label: i18n.t('common.status')
    },
    {
      key: 'affinity',
      label: i18n.t('applications.affinity'),
      tip: 'APPLICATION_POD_AFFINITY_TIP'
    },
    {
      key: 'node',
      label: i18n.t('applications.runNode')
    },
    {
      key: 'labels',
      label: i18n.t('applications.labels')
    },
    {
      key: 'annotations',
      label: i18n.t('applications.annotations')
    }
  ],
  instance: [
    {
      key: 'bdc',
      label: i18n.t('menu.bigDataCluster'),
      sign: 'appBdcNotReadyTip',
      defaultType: 'bigDataCluster'
    },
    {
      key: 'catalog',
      label: i18n.t('applications.fromCatalog')
    },
    {
      key: 'appForm',
      label: i18n.t('applications.fromApp')
    },
    {
      key: 'updateTime',
      label: i18n.t('applications.lastOperationTime'),
      format: 'time'
    },
    {
      key: 'status',
      label: i18n.t('common.status')
    }
  ],
  bigDataCluster: [
    {
      key: 'status',
      label: i18n.t('common.status')
    },
    {
      key: 'namespace',
      label: i18n.t('common.namespace')
    },
    {
      key: 'createTime',
      label: i18n.t('common.createdAt'),
      format: 'time'
    },
    {
      key: 'labels',
      label: i18n.t('applications.labels')
    },
    {
      key: 'description',
      label: i18n.t('common.description')
    }
  ],
  updateApp: [
    {
      key: 'bdc',
      label: i18n.t('menu.bigDataCluster'),
      isLink: false,
      defaultType: 'bigDataCluster'
    },
    {
      key: 'catalog',
      label: i18n.t('applications.fromCatalog')
    },
    {
      key: 'appForm',
      label: i18n.t('applications.fromApp')
    },
    {
      key: 'appName',
      label: i18n.t('applications.instance')
    },
    {
      key: 'labels',
      label: i18n.t('applications.labels')
    },
    {
      key: 'annotations',
      label: i18n.t('applications.annotations')
    }
  ]
})