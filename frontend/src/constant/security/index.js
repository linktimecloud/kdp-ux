/**
 * import i18n
 */
import i18n from '@/i18n'

export const GROUP_TYPES = () => ([
  { label: i18n.t('common.allType'), value: 'all' },
  { label: i18n.t('common.organization'), value: 'organization' },
  { label: i18n.t('common.public'), value: 'public' },
  { label: i18n.t('common.other'), value: '' }
])

export const ENTITY_STATUS = () => ([
  { label: i18n.t('common.all'), value: '' },
  { label: i18n.t('users.enabled'), value: '1' },
  { label: i18n.t('users.disabled'), value: '0' }
])

export const GROUP_LIST_FILTER = () => ({
  q: '',
  type: 'all',
  enabled: ''
})

export const CREATE_GROUP_FORM = () => ({
  type: 'organization',
  name: '',
  displayName: '',
  desc: ''
})
