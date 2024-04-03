const path = require('path')
const { v4: uuid } = require('uuid')

const { ApiErrorNames, ApiError } = require(path.join(global.UTILPATH, 'error'))
const { Process, Log } = require(global.MODELPATH)

const createProcess = async (ctx, options) => {
  const {
    handle,
    category,
    name,
    status = 0,
    pid = uuid()
  } = options

  if (!(handle && category && name)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }

  try {
    await Process.create({
      handle,
      category,
      name,
      pid,
      userId: ctx.state?.user?.userName || 'system',
      status
    })

    if (!process) {
      throw new ApiError(ApiErrorNames.CREATE_PROCESS_FAILED)
    }

    return { status: true, pid }
  } catch (e) {
    const message = typeof e === 'object' ? e.message : e
    return { status: false, message }
  }
}

const addLog = async (pid, content, level = 'INFO') => {
  return pid && await Log.create({
    lid: uuid(),
    processId: pid,
    level,
    content
  })
}

const updateProcessStatus = async (pid, status) => {
  return pid && await Process.update({ status }, { where: { pid } })
}

module.exports = {
  createProcess,
  addLog,
  updateProcessStatus
}
