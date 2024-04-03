import i18n from '@/i18n'

export const PAGINATION = (limit = 10) => ({
  limit,
  total: 0,
  start: 0
})

export const STATUS_MAPPER = () => ({
  0: 'running',
  1: 'success',
  2: 'failed',
  3: 'running'
})

export const PUBLISH_STATUS = () => ({
  0: 'draft',
  1: 'published'
})

export const ENABLE_STATUS = () => ({
  0: 'disabled',
  1: 'enabled'
})

export const IMAGE_LIST = () => ([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'ico'
])

export const TICKET_FORM = () => ({
  category: '',
  content: '',
  title: '',
  priority: 2,
  fileList: []
})

export const LICENSE_FORM = () => ({
  clusterLicense: ''
})

export const ADDITION_NODE = () => ({
  name: '',
  ip: '',
  PublicIpAddress: '',
  type: 'agent'
})

export const KERBEROS_INFO = () => ({
  active: true
})

export const ENTITY_STATUS = () => ([
  { label: 'common.all', value: '' },
  { label: 'users.enabled', value: '1' },
  { label: 'users.disabled', value: '0' }
])

export const ONE_MINUTE_AS_MS = 60 * 1000
export const ONE_HOUR_AS_MS = 3600 * 1000
export const ONE_DAY_AS_MS = 24 * 3600 * 1000

export const TIME_DURATION_SHORTCUTS = () => ([
  { label: i18n.t('time.lastestThreeHours'), duration: 3 * ONE_HOUR_AS_MS },
  { label: i18n.t('time.lastestSixHours'), duration: 6 * ONE_HOUR_AS_MS },
  { label: i18n.t('time.lastestTwelveHours'), duration: 12 * ONE_HOUR_AS_MS },
  { label: i18n.t('time.lastestTwentyFourHours'), duration: 1 * ONE_DAY_AS_MS },
  { label: i18n.t('time.lastestTwoDays'), duration: 2 * ONE_DAY_AS_MS },
  { label: i18n.t('time.lastestSevenDays'), duration: 7 * ONE_DAY_AS_MS }
])

export const MIN_CPU = 0.1

export const MIN_MEMORY = 128

export const MIN_DISK = 1

export const MIN_INSTANCES = 1

export const SUPPORTED_LANG_LIST = () => ([
  {
    lang: 'zh',
    text: '简体中文'
  },
  {
    lang: 'en',
    text: 'English'
  }
])

export const LOG_TYPE_LIST = () => ([
  {
    name: i18n.t('log.stdout'),
    value: 'stdout'
  },
  {
    name: i18n.t('log.stderr'),
    value: 'stderr'
  },
  {
    name: i18n.t('log.file'),
    value: 'file'
  }
])
