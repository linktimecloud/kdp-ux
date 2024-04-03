export const RULE_SEPARATOR = '__d__'

export const ALL_PEOPLE_VALUE = 'all_people'

export const POLICIES_ACTION = () => ([
  {
    value: 'deny',
    cls: 'text-danger'
  },
  // 本期暂不支持，先注释
  // {
  //   value: 'readonly',
  //   cls: 'text-gray'
  // },
  {
    value: 'grant',
    cls: 'text-success'
  }
])

export const DEFAULT_SETTINGS_FEATURE_FORM = ({
  LANG = false,
  // MANUAL = false,
  AVATAR = true,
  RSAKEY = false,
  // TICKETS = false,
  // ISSUES = false,
  BDTJ = false,
  BDTJTRACKID = ''
  // NODEMANAGER = false,
  // NODESCALE = false
} = {}) => ({
  LANG,
  // MANUAL,
  AVATAR,
  RSAKEY,
  // TICKETS,
  // ISSUES,
  BDTJ,
  BDTJTRACKID
  // NODEMANAGER,
  // NODESCALE
})

export const DEFAULT_OEM_FORM = (data = {}, isAll) => {
  const { title = '', icon = '', favicon = '', home = '' } = data
  const ret = {
    title,
    icon,
    favicon,
    home
  }
  if (isAll) ret.features = DEFAULT_SETTINGS_FEATURE_FORM(data.features)
  return ret
}
