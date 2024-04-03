const BigDataClusterInfo = () => import(/* webpackChunkName: 'BigDataClusterInfo' */ '@/pages/bigDataCluster/info')
const BigDataClusterOverview = () => import(/* webpackChunkName: 'BigDataClusterOverview' */ '@/pages/bigDataCluster/overview')
const CatalogHomepage = () => import(/* webpackChunkName: "CatalogHomepage" */ '@/pages/apps/catalogHomepage')
const LogViewer = () => import(/* webpackChunkName: "LogViewer" */ '@/pages/record/logviewer')
const Process = () => import(/* webpackChunkName: "Process" */ '@/pages/record/process')

const NEED_AUTH = {
  requiresAuth: true
}
const NEED_CLUSTER = {
  requiresAuth: true,
  requiresCluster: true
}

const routes = [
  { path: '/bigDataClusterInfo', name: 'bigDataClusterInfo', component: BigDataClusterInfo, meta: NEED_AUTH, property: { showInMenu: true } },
  { path: '/bigDataClusterOverview', name: 'bigDataClusterOverview', component: BigDataClusterOverview, meta: NEED_AUTH, property: { showInMenu: true } },

  { path: '/process', name: 'process', component: Process, meta: NEED_CLUSTER, property: { showInMenu: true } },
  { path: '/logviewer', name: 'logviewer', component: LogViewer, meta: NEED_CLUSTER, property: { showInMenu: true } },

  { path: '/catalogHomepage/:name', name: 'catalogHomepage', component: CatalogHomepage, meta: NEED_AUTH, property: { showInMenu: true } },

  { path: '*', redirect: 'bigDataClusterOverview' }
]

export default routes
