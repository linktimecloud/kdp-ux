import i18n from '@/i18n'

export const CUSTOM_APP_SOURCE = () => ([
  {
    label: i18n.t('applications.runningApp'),
    value: 'running'
  }, {
    label: i18n.t('applications.installedApp'),
    value: 'installed'
  }
])

export const DEFAULT_CUSTOM_APP_TYPE = () => ([
  {
    label: 'spring-boot',
    value: 'spring-boot'
  }, {
    label: 'tomcat',
    value: 'tomcat'
  }, {
    label: 'docker',
    value: 'docker'
  }
])
