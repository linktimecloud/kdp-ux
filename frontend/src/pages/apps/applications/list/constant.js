import i18n from '@/i18n'
import { SYSTEM_APPLICATION_STATUS } from '@/constant/application'
import { get } from 'lodash'

export const DEFAULT_FILTER = () => ({
  name: '',
  status: '',
  catalog: '',
  catalogType: ''
})

export const APPLICATION_LIST_COLUMNS = () => ([
  {
    prop: 'name',
    label: i18n.t('applications.renderApp'),
    minWidth: 180,
    show: true,
    disabled: true
  },
  {
    prop: 'bdc',
    label: i18n.t('menu.bigDataCluster'),
    minWidth: 150,
    show: true
  },
  {
    prop: 'catalog',
    label: i18n.t('applications.loadBalancer.appCatalog'),
    minWidth: 150,
    show: true
  },
  {
    prop: 'status',
    label: i18n.t('common.status'),
    minWidth: 130,
    show: true
  },
  {
    prop: 'updateTime',
    label: i18n.t('applications.lastOperationTime'),
    minWidth: 170,
    show: true
  },
  {
    prop: 'operate',
    label: i18n.t('common.operate'),
    width: 170,
    disabled: true,
    show: true
  }
])

export const APPLICATION_PROPERTIES = (data = {}) => ([
  {
    name: 'name',
    label: '',
    type: 'input',
    placeholder: `${i18n.t('common.search')}${i18n.t('applications.renderApp')}`
  },
  {
    name: 'status',
    label: i18n.t('common.status'),
    type: 'select',
    options: SYSTEM_APPLICATION_STATUS()
  },
  {
    name: 'catalog',
    label: i18n.t('catalogs.name'),
    type: 'input',
    placeholder: i18n.t('common.input')
  },
  {
    name: 'catalogType',
    label: i18n.t('catalogs.type'),
    type: 'select',
    allowCreate: true,
    options: [{ value: '', label: i18n.t('common.all') }, ...get(data, 'catalogTypeList', [])]
  }
])