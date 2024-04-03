import * as ENV from '@/env'
const state = {
  env: {
    ...ENV
  },
  ws: {},
  processes: null,
  layoutTypes: ['panel', 'plain'],
  showManual: false,
  layoutType: '',
  layoutCollapse: false,
  navbarType: '',
  lang: ENV.DEFAULT_LANG,
  currentUser: null,
  manualList: null,
  isAdmin: false,
  isRoot: false,
  isDev: false,
  loadingOptions: {
    show: 0,
    closable: true,
    text: ''
  },
  customizeEnv: {
    features: {
      LANG: true
    }
  },
  userPermissions: {},
  systemHealthy: true,
  userAvatar: '',
  tipsCache: {},
  currentBdcInfo: {}
}

export default state
