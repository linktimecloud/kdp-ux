const { omit, pick } = require('lodash')
const log4js = require('log4js')
const config = require('config')

// config
log4js.configure(config.get('LOG'))

const logUtil = {}
const resLogger = log4js.getLogger('default')
const errorLogger = log4js.getLogger('error')
const behaviorLogger = log4js.getLogger('log')

const isSystemError = (error) => {
  if (!error || !error.code) {
    return false
  }

  // https://nodejs.org/api/errors.html#errorcode_1
  const COMMON_SYSTEM_ERROR_CODE = [
    'EADDRINUSE',
    'ECONNREFUSED',
    'ECONNRESET',
    'ENOTFOUND',
    'EPIPE',
    'ETIMEDOUT'
  ]
  return (
    error.type === 'system' || COMMON_SYSTEM_ERROR_CODE.includes(error.code)
  )
}

// format request log
const formatReqLog = (ctx, resTime) => {
  const { method, originalUrl, ip: clientIp, query, body } = ctx.request

  return {
    method,
    originalUrl,
    clientIp,
    query,
    body,
    resTime
  }
}

// format response log
const formatRes = (ctx, resTime) => {
  const { status, body } = ctx
  return {
    status,
    body: {
      // 过滤掉接口的具体返回数据，避免log内容过大
      ...omit(body, 'data')
    }
  }
}

// format error log
const formatError = (ctx, err, resTime) => {
  return {
    ...pick(err, ['name', 'message', 'stack'])
  }
}

// format behavior log
const formatUser = (ctx, resTime) => {
  const { user } = ctx.state || {}
  const { groups: rawGroups, userName, uid } = user || {}
  const groups = rawGroups ? rawGroups.map((g) => g.name) : []
  return { userName, uid, groups }
}

// format behavior log
const formatBehavior = (ctx, resTime, type, opt) => {
  const { request, status, query = {} } = ctx
  const { header } = request

  const behavior = {
    type,
    time: opt.start,
    client_ip: '',
    app_name: config.get('APP_NAME'),
    agent: header['user-agent']
  }

  const body = { ...request.body }
  delete body.third
  delete body.uid
  delete body.user
  delete body.email
  // TODO: 重构完成以后，可以删除以下两段代码
  delete body.agents
  delete body.cluster

  const data = { ...ctx.body }
  delete data.data

  behavior.user = formatUser(ctx)

  if (type === 'api') {
    behavior.api = {
      request_method: request.method,
      request_url: request.href,
      request_query: JSON.stringify(query || {}),
      request_body: JSON.stringify(body || {}),
      response_time: resTime,
      response_status: status,
      response_data: JSON.stringify(data || {})
    }
  } else if (type === 'path') {
    const { name = '', refer = '', path = '', course } = opt || {}
    behavior.path = { name, refer, path, course }
  } else if (type === 'action') {
    const { name = '', path = '', course } = opt || {}
    behavior.action = { name, path, course }
  }

  return JSON.stringify(behavior)
}

const getTime = () => new Date().toLocaleString()

// package errorLog function
logUtil.logError = (ctx, error, resTime) => {
  if (ctx && error) {
    const errMsg = {
      request: formatReqLog(ctx, resTime),
      error: formatError(ctx, error, resTime)
    }
    errorLogger.error(JSON.stringify(errMsg))
  }
}

// log service raw error
logUtil.logRawError = (ctx, rawError) => {
  if (rawError) {
    const error = rawError
    if (rawError.error instanceof Error) {
      // 兼容 fetch 的 error 处理
      const { code, type: errorType } = rawError.error
      if (code === 'ECONNREFUSED') {
        error.error.message = 'reason: connect ECONNREFUSED'
      } else if (errorType === 'invalid-json') {
        error.error.message = 'Data type is incorrect'
      }
      console.log('error.message', error.error.message)
    }

    // 通过原始错误判断是否是系统错误，如果是，则标记为 system
    const type = isSystemError(rawError.error) ? 'system' : rawError.type

    if (['api', 'proxy', 'system'].includes(type)) {
      error.type = type
      error.user = formatUser(ctx)
    }

    console.log(`[${getTime()}] Logging raw error => `, JSON.stringify(error))
    errorLogger.error(JSON.stringify(error))
  }
}

// package responseLog function
logUtil.logResponse = (ctx, resTime) => {
  if (ctx) {
    const resMsg = {
      request: formatReqLog(ctx, resTime),
      response: formatRes(ctx, resTime)
    }
    resLogger.info(JSON.stringify(resMsg))
  }
}

logUtil.logBehavior = (ctx, resTime, type = 'api', data = {}) => {
  if (ctx) {
    if (type === 'toast') {
      errorLogger.error(JSON.stringify(omit(data, ['type'])))
    } else {
      const userBehavior = formatBehavior(ctx, resTime, type, data)
      behaviorLogger.trace(userBehavior)
    }
  }
}

module.exports = logUtil
