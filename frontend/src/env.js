import { SUPPORTED_LANG_LIST } from '@/constant'
const viteEnv = import.meta.env

const getEnv = (key, defaultVal) => viteEnv[`VITE_${key}`] || viteEnv[`${key}`] || defaultVal

const supportedLangs = SUPPORTED_LANG_LIST()
const lang = getEnv('DEFAULT_LANG') || localStorage.getItem('lang') || (navigator.language || navigator.userLanguage || 'zh').substr(0, 2)

export const DEFAULT_LANG = supportedLangs.find(item => item.lang === lang) ? lang : supportedLangs[0].lang

export const DEV_TOOL = getEnv('DEV_TOOL')
export const WS_BASE = getEnv('WS_BASE')
export const API_SERIES = getEnv('API_SERIES')
export const API_VERSION = getEnv('API_VERSION')
export const API_PATH = getEnv('API_PATH', 'api/')
export const API_BASE = getEnv('API_BASE') === '/' ? '' : getEnv('API_BASE')
export const URI_BASE = API_BASE + (API_PATH === '/' ? '' : API_PATH)
export const ACCEPT = `application/json;${API_SERIES}, version=${API_VERSION}`
export const CONTENT_TYPE = 'application/x-www-form-urlencoded'

export const NODE_ENV = process.env.NODE_ENV
export const API_TOKEN = getEnv('API_TOKEN')
export const LDAP_DISABLED_MENU = ['users']

export const HOMEPAGE_CN = getEnv('HOMEPAGE_CN')
export const HOMEPAGE_EN = getEnv('HOMEPAGE_EN')

export const MANUAL_BASE = getEnv('MANUAL_BASE')
