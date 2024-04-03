import i18n from '@/i18n'
import { POD_STATUS_MAP } from '@/constant/application'

export const CAPACITY_USAGE_COLUMNS = ['cpu', 'memory']

export const POD_QUS_CLASS = ['Guaranteed', 'Burstable', 'BestEffort']

export const POD_COLUMNS = () => ([
  {
    prop: 'pod',
    label: i18n.t('applications.podName'),
    minWidth: 180,
    show: true,
    disabled: true
  },
  {
    prop: 'workloadName',
    label: i18n.t('menu.loadbalancer'),
    minWidth: 180,
    show: true
  },
  {
    prop: 'status',
    label: i18n.t('common.status'),
    minWidth: 100,
    show: true
  },
  {
    prop: 'creationTime',
    label: i18n.t('applications.loadBalancer.createTime'),
    minWidth: 180,
    show: true
  },
  {
    prop: 'containers',
    label: i18n.t('applications.container'),
    minWidth: 80,
    show: true
  },
  {
    prop: 'restartCount',
    label: i18n.t('applications.restartNum'),
    minWidth: 120,
    show: true,
    align: 'right'
  },
  {
    prop: 'nodeName',
    label: i18n.t('applications.runNode'),
    minWidth: 150,
    show: true
  },
  ...CAPACITY_USAGE_COLUMNS.map(item => {
    return {
      prop: item,
      label: i18n.t(`common.${item}`),
      minWidth: 140,
      show: true
    }
  }),
  {
    prop: 'qosClass',
    label: i18n.t('applications.qosClass'),
    minWidth: 150,
    show: true,
    tip: 'QOS_CLASS_TIP'
  },
  {
    prop: 'operate',
    label: i18n.t('common.operate'),
    minWidth: 220,
    disabled: true,
    show: true
  }
])

export const DEFAULT_FILTER = ({
  pod = '',
  node = '',
  qosClass = '',
  status = ''
} = {}) => ({
  pod,
  node,
  qosClass,
  status
})

export const POD_PROPERTIES = () => ([
  {
    name: 'pod',
    label: '',
    type: 'input',
    placeholder: `${i18n.t('common.search')}${i18n.t('applications.app')}${i18n.t('applications.podName')}`
  },
  {
    name: 'status',
    label: i18n.t('common.status'),
    type: 'select',
    options: POD_STATUS_MAP.map(item => {
      return {
        label: i18n.t(`applications.podStatusLabel.${item}`),
        value: item
      }
    }).unshift({ label: i18n.t('common.all'), value: '' })
  },
  {
    name: 'qosClass',
    label: i18n.t('applications.qosClass'),
    type: 'select',
    options: POD_QUS_CLASS.map(item => {
      return {
        label: item,
        value: item
      }
    }).unshift({ label: i18n.t('common.all'), value: '' })
  }
])