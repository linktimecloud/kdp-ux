const { omit } = require('lodash')
const fetch = require('node-fetch')
const config = require('config')

const { findProxyService, getAuthorizationToken } = require('./proxyTable')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')
const logUtil = require(global.UTILPATH + 'log')

module.exports = async (ctx, next) => {
  const proxyService = findProxyService(ctx)

  if (!proxyService) {
    await next()
    return
  }

  const { method, originalUrl } = ctx
  const XProxyHeader = config.get('APP_NAME')
  const {
    name,
    headers: proxyHeaders = {},
    // 请求服务地址
    target,
    // 请求路径重写
    reqPathRewriter = str => str,
    // 响应返回数据转换
    resBodyAdaptor = rsp => ({ data: rsp.data, error: rsp.error, status: rsp.status }),
    successStatusCode = global.WEBUI_SUCCESS_CODE
  } = proxyService

  if (!target) {
    throw new Error(
      `not find proxy service ${name} target`
    )
  }

  const targetPath = reqPathRewriter(originalUrl)
  const BASE = /^http/.test(target) ? target : `http://${target}`
  const url = `${BASE}${targetPath}`

  let rawResponse

  console.log(`Proxy Call ${name} =>`, JSON.stringify({
    url
  }))

  const Authorization = getAuthorizationToken(ctx)
  const language = ctx.query.lang || ctx.get('Accept-Language') || ctx.get('accept-language')
  const headers = {
    ...omit(ctx.req.headers, ['authorization', 'host', 'accept-language']),
    'X-Special-Proxy-Header': XProxyHeader,
    'Accept-Language': language,
    ...proxyHeaders,
    Authorization
  }

  try {
    rawResponse = await fetch(url, {
      method,
      body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : ctx.req,
      timeout: 300000,
      headers
    })

    if (rawResponse.headers.get('content-type').includes('text/html')) {
      ctx.set('Content-Type', rawResponse.headers.get('content-type'))
      ctx.body = rawResponse.body
      return
    }

    const data = await rawResponse.json()

    if (!data) {
      throw new ApiError(ApiErrorNames.API_INTERNAL_ERROR, {
        description: ctx.t('error.proxy.requestUrlEmpty', { url: ctx.url }),
        solution: ctx.t('error.proxy.pleaseCheckServicePath')
      })
    }

    const isSuccess = data.status === successStatusCode
    const status = isSuccess
      ? global.WEBUI_SUCCESS_CODE
      : '260000'

    if (!isSuccess) {
      logUtil.logRawError(ctx, {
        type: 'proxy',
        url: ctx.url,
        proxy: { url, proxyHeaders, XProxyHeader },
        response: data
      })
    }

    const message = isSuccess ? 'Success' : (data.message || 'Service Error')
    ctx.body = {
      ...resBodyAdaptor(data),
      message,
      status
    }
  } catch (error) {
    const isApiError = error instanceof ApiError
    if (!isApiError) {
      logUtil.logRawError(ctx, {
        type: 'proxy',
        url: ctx.url,
        proxy: { url, proxyHeaders, XProxyHeader },
        error,
        response: rawResponse
      })
    }

    const serviceName = name
    const message = typeof error === 'object' ? error.message : error
    ctx.body = new ApiError(ApiErrorNames.API_INTERNAL_ERROR, {
      description: `${serviceName}: ${message}`,
      solution: ctx.t('error.pleaseCheckSpecifiedServiceStatus', { name: serviceName })
    })
  }
}
