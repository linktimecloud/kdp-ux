import i18n from '@/i18n'

export const QUOTA_TYPE = {
  'requests.storage': {
    label: 'Disk',
    maxDataShadow: 100,
    unit: 'GB'
  },
  'limits.memory': {
    label: 'Memory',
    maxDataShadow: 100,
    unit: 'GB'
  },
  'limits.cpu': {
    label: 'CPU',
    maxDataShadow: 100,
    unit: i18n.t('applications.core')
  }
}

const MIN_CPU = 0.1
const MIN_MEMORY = 128 * 1024 ** 2

export const QUOTA_SETTING_TYPES = () => ([
  {
    paths: ['limits', 'cpu'],
    labelKey: 'limitsCPU',
    min: MIN_CPU
  },
  {
    paths: ['limits', 'memory'],
    labelKey: 'limitsMemory',
    min: MIN_MEMORY,
    isTransform: true
  },
  {
    paths: ['requests', 'cpu'],
    labelKey: 'requestCPU',
    min: MIN_CPU
  },
  {
    paths: ['requests', 'memory'],
    labelKey: 'requestMemory',
    min: MIN_MEMORY,
    isTransform: true
  },
  {
    paths: ['requests', 'storage'],
    labelKey: 'requestStorage',
    min: MIN_MEMORY,
    isTransform: true
  }
])

export const QUOTA_THRESHOLD = { LOW: 80, MEDIUM: 100 }
