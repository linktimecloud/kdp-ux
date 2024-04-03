export const GLOBAL_GROUP = () => ({
  gid: '0',
  name: 'Global',
  desc: 'Global Roles'
})

export const ROLE_TYPES = () => ({
  0: 'common',
  1: 'admin',
  9: 'devops'
})

export const REDIRECT_MODES = () => ([
  'home',
  'warning'
])

export const FORM = (opt = {}) => ({
  name: '',
  description: '',
  permissions: {
    menu: [],
    rest: []
  },
  view: {
    home: opt.home || '',
    redirect: {
      mode: 'home',
      external: ''
    }
  }
})
