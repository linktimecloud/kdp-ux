const config = require('config')

const {
  CATALOG_MANAGER_DOMAIN
} = config.get('SERVICE_DOMAIN')

const PROXY_TABLE = [
  {
    name: 'Catalog manager Service',
    prefix: [
      'catalogManagerService'
    ],
    successStatusCode: 0,
    reqPathRewriter: path => path.replace('/api/catalogManagerService', ''),
    target: CATALOG_MANAGER_DOMAIN
  }
]

const findProxyService = ctx => {
  const { path: originalPath } = ctx

  const path = originalPath.replace(/\/api\//, '')
  const pathPrefix = path.split('/')[0] || ''

  return PROXY_TABLE.find(({
    prefix
  }) => prefix.includes(pathPrefix)) || null
}

const getAuthorizationToken = ctx => {
  let token = ctx.get('authorization') || ctx.get('Authorization') || ''
  if (token && !token.startsWith('Bearer')) {
    token = `Bearer ${token}`
  }

  return token
}

module.exports = {
  findProxyService,
  getAuthorizationToken
}
