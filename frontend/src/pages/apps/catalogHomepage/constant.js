import i18n from '@/i18n'

import SystemAppsList from '@/pages/apps/catalogHomepage/SystemAppsList.vue'
import InstallList from '@/pages/apps/catalogHomepage/InstallList.vue'
import AppInstruction from '@/pages/apps/catalogHomepage/AppInstruction.vue'
import AppsList from '@/pages/apps/catalogHomepage/AppsList.vue'

export const CATALOG_COMPONENTS_MAP = ({ name, sub }) => {
  return {
    system: {
      tabs: [
        {
          name: 'homepage',
          components: [
            {
              name: 'SystemAppsList',
              component: SystemAppsList,
              componentTitle: i18n.t('applications.app'),
              options: {
                name
              },
              isTable: true
            },
            {
              name: 'InstallList',
              component: InstallList,
              componentTitle: i18n.t('applications.containerRunningNum'),
              options: {
                name,
                catalog: name
              },
              isTable: true,
              showRefresh: true
            }
          ]
        },
        {
          name: 'instructions',
          components: [
            {
              name: 'appInstruction',
              component: AppInstruction,
              options: {
                catalog: name
              }
            }
          ]
        }
      ]
    },
    apps: {
      tabs: [
        {
          name: 'homepage',
          components: [
            {
              name: 'AppsList',
              component: AppsList,
              isTable: true,
              componentTitle: i18n.t('applications.appMode'),
              options: {
                catalog: name,
                form: sub
              }
            },
            {
              name: 'InstallList',
              component: InstallList,
              componentTitle: i18n.t('applications.containerRunningNum'),
              options: {
                name,
                catalog: name,
                form: sub
              },
              isTable: true,
              showRefresh: true
            }
          ]
        },
        {
          name: 'operationAndMaintenanceGuide',
          components: [{
            name: 'appInstruction',
            component: AppInstruction,
            options: {
              catalog: name,
              form: sub
            }
          }]
        }
      ]
    }
  }
}