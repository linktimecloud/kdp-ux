const { omit } = require('lodash')

const router = require('koa-router')()
const axios = require('axios')

const path = require('path')

const createProcess = require(path.join(global.UTILPATH, 'createProcess'))

const config = require('config')
const { CATALOG_MANAGER_DOMAIN, PROCESS_DOMAIN } = config.get('SERVICE_DOMAIN')

const getReqPath = ctx => {
  const { path, query, method } = ctx.request

  const servicePath = path.replace(/\/api\/bpaasCoreService\//, '/')
  let reqPath = `${CATALOG_MANAGER_DOMAIN}/${servicePath}`

  if (method.toLowerCase() === 'get') {
    const url = new URL(reqPath)
    for (const k in query) {
      url.searchParams.append(k, query[k])
    }
    reqPath = url.href
  }
  return reqPath
}

const getProcessInfo = (pid) => ({
  actionId: pid,
  webhook: {
    status: {
      url: `${PROCESS_DOMAIN}/api/processes/${pid}`,
      method: 'PUT'
    },
    log: {
      url: `${PROCESS_DOMAIN}/api/logs/${pid}`,
      method: 'POST'
    }
  }
})

const formatBody = async (ctx) => {
  const body = ctx.request.body || {}
  const { appendWebhook, processInfo = {} } = body

  let ret = body
  if (appendWebhook) {
    const { pid } = await createProcess(ctx, processInfo)
    ret = {
      ...omit(body, ['appendWebhook', 'processInfo']),
      ...getProcessInfo(pid)
    }
  }

  return ret
}

router.all('/(.*)', async ctx => {
  try {
    const { request } = ctx
    const { method } = request

    const headers = {
      'Accept-Language': ctx.headers['Accept-Language'],
      'Content-Type': ctx.headers['content-type']
    }

    const form = await formatBody(ctx)

    const rawResponse = await axios({
      url: getReqPath(ctx),
      method,
      data: form,
      timeout: 30000,
      headers
    })
    const { data } = rawResponse

    const status = data.status === 0
      ? global.WEBUI_SUCCESS_CODE
      : '260000'

    ctx.body = {
      ...data,
      status
    }
  } catch (e) {
    console.log('Fetch BpaasCoreService error', e)
    throw e
  }
})

module.exports = router
