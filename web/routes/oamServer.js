const { omit } = require('lodash')

const router = require('koa-router')()
const axios = require('axios')

const path = require('path')

const { createProcess, addLog, updateProcessStatus } = require(path.join(global.UTILPATH, 'handleProcess'))
const { PROCESS_STATUS } = require(global.CONSTANTPATH)

const config = require('config')
const { OAM_API_SERVER_DOMAIN } = config.get('SERVICE_DOMAIN')

const getReqPath = ctx => {
  const { path } = ctx.request

  const servicePath = path.replace(/\/api\/oamServer\//, 'api/')
  return `${OAM_API_SERVER_DOMAIN}/${servicePath}`
}

const handleAsyncCallService = async (ctx, { rawReqBody, pid, actionText = 'create' }) => {
  try {
    await addLog(pid, `Start Call OAM-API-Server ${actionText}`)

    const response = await axios({
      url: getReqPath(ctx),
      method: ctx.method,
      params: ctx.query,
      data: rawReqBody,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    const rsp = response.data

    if (rsp.status === 0) {
      await addLog(pid, `Call OAM-API-Server ${actionText} completed!`)
      await updateProcessStatus(pid, PROCESS_STATUS.SUCCESS)
    } else {
      await addLog(pid, `${actionText} error: ${rsp.message}`, 'ERROR')
      await updateProcessStatus(pid, PROCESS_STATUS.FAILED)
    }
  } catch (e) {
    console.log('Call OAM-API-Server error', e)
    await addLog(pid, `${actionText} error: ${JSON.stringify(e)}`, 'ERROR')
    await updateProcessStatus(pid, PROCESS_STATUS.FAILED)
    throw e
  }
}

const handleCallService = async (ctx) => {
  const url = getReqPath(ctx)

  console.log('Proxy Call OAM-API-Server =>', JSON.stringify({
    url
  }))

  const response = await axios({
    url,
    method: ctx.method,
    params: ctx.query,
    data: ctx.request.body,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  const rsp = response.data

  if (rsp.status !== 0) {
    ctx.state.raw = { ...rsp, status: 260000 }
  }
  ctx.body = rsp.data || {}
}

router.all('/(.*)', async ctx => {
  let form = ctx.request.body || {}

  const { appendWebhook, processInfo = {} } = form || {}
  if (appendWebhook) {
    const { pid } = await createProcess(ctx, processInfo)
    const actionText = `${processInfo?.handle} ${processInfo?.name} ${processInfo?.category}`
    form = {
      ...omit(form, ['appendWebhook', 'processInfo'])
    }
    ctx.body = {
      pid
    }

    handleAsyncCallService(ctx, { rawReqBody: form, pid, actionText })
  } else {
    await handleCallService(ctx)
  }
})

module.exports = router
