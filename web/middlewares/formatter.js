const { capitalize, get } = require('lodash')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')

const SUCCESS_STATUS = global.WEBUI_SUCCESS_CODE

module.exports = (pattern) => {
  return async (ctx, next) => {
    const { originalUrl, response } = ctx

    const reg = new RegExp(pattern)
    let data = {}
    try {
      if (ctx.proxy) {
        return
      }

      await next()

      // 响应头中包含 content-type: text/html, 直接返回给前端html的内容，不需要再包一层ctx.body
      const contentType = ctx.response.header['content-type']
      const isDocRsp = contentType && (contentType.includes('text/html') || contentType.includes('image/png'))

      if (reg.test(originalUrl) && !isDocRsp) {
        if (ctx.body) {
          if (get(ctx, 'state.raw.status', '').toString() === '260000') {
            ctx.body = {
              ...ctx.state.raw,
              data: ctx.body || response
            }
          } else {
            ctx.body = {
              data: ctx.body || response,
              status: SUCCESS_STATUS,
              message: { desc: 'Success' }
            }
          }
        } else {
          throw new ApiError(ApiErrorNames.API_INTERNAL_ERROR, {
            description: ctx.t('error.responseBodyEmpty'),
            solution: ctx.t('error.pleaseCheckServiceStatus')
          })
        }
      }
    } catch (error) {
      if (error instanceof ApiError && reg.test(originalUrl)) {
        // set custom ApiError as our response data
        data = error
      } else {
        const service = originalUrl.replace(/\?.*/g, '').split('/')[2]
        const message = typeof error === 'object' ? error.message : error
        data = new ApiError(ApiErrorNames.API_INTERNAL_ERROR, {
          description: `${capitalize(service)}: ${message}`,
          solution: ctx.t('error.pleaseCheckSpecifiedServiceStatus', { name: capitalize(service) })
        })
      }
      ctx.body = data
    }
  }
}
