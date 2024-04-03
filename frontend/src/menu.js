import { CORE_COMPONENT_MAP } from '@/constant/application'

const MENU = [
  {
    name: 'bigDataClusterManagement',
    index: 'bigDataClusterManagement',
    icon: 'ri-hard-drive-2-line',
    sub: [
      { name: 'bigDataClusterOverview', index: 'bigDataClusterOverview' },
      { name: 'bigDataClusterInfo', index: 'bigDataClusterInfo' }
    ]
  },
  {
    name: 'catalogHomepage',
    index: 'catalogHomepage',
    icon: 'ri-list-settings-line',
    groups: Object.keys(CORE_COMPONENT_MAP()).map(title => ({
      title,
      sub: CORE_COMPONENT_MAP()[title].map(name => ({ name, index: name }))
    }))
  },
  {
    name: 'record',
    index: 'record',
    icon: 'ri-file-text-line',
    sub: [
      { name: 'logviewer', index: 'logviewer' },
      { name: 'process', index: 'process' }
    ]
  }
]

export default MENU
