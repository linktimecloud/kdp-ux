const path = require('path')
const { v4: uuid } = require('uuid')

const { ApiErrorNames, ApiError } = require(path.join(global.UTILPATH, 'error'))
const { Process } = require(global.MODELPATH)

module.exports = async (ctx, options) => {
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
