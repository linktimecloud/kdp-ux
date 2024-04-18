const routes = [
  {
    path: '/bigDataClusterInfo',
    name: 'bigDataClusterInfo',
    component: () => import('@/pages/bigDataCluster/info/BdcHomepage.vue')
  },
  {
    path: '/bigDataClusterOverview',
    name: 'bigDataClusterOverview',
    component: () => import('@/pages/bigDataCluster/overview/BdcOverview.vue')
  },
  {
    path: '/process',
    name: 'process',
    component: () => import('@/pages/record/process/ProcessView.vue')
  },
  {
    path: '/logviewer',
    name: 'logviewer',
    component: () => import('@/pages/record/logviewer/LogViewer.vue')
  },

  {
    path: '/catalogHomepage/:name',
    name: 'catalogHomepage',
    component: () => import('@/pages/apps/catalogHomepage/HomepageView.vue')
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: 'bigDataClusterOverview'
  }
]

export default routes
