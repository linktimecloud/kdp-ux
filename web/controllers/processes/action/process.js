const config = require('config')
const { v4: uuid } = require('uuid')
const { toNumber } = require('lodash')
const { Op, Process, Log } = require(global.MODELPATH)
const { processFormat, logFormat } = require(global.UTILPATH + 'format')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')
const { checkProcessExist } = require(global.UTILPATH + 'utils')

/**
  * @api {get} /processes/:pid GET_PROCESSES_PID
  * @apiName GET_PROCESSES_PID
  * @apiGroup Processes
  *
  * @apiParam {String} pid Process unique id.
  * @apiParamExample {json} Request-Example:
    {
      "pid": "58d9d5d6ae4908076eb16cfe",
      "start": 0,
      "limit": 10
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object} data.pagination Process logs pagination.
  * @apiSuccess {String} data.pagination.total Process logs pagination total.
  * @apiSuccess {String} data.pagination.limit Process logs pagination limit.
  * @apiSuccess {String} data.pagination.start Process logs pagination start.
  * @apiSuccess {String} data.pid Process unique id.
  * @apiSuccess {String} data.handle Process handle.
  * @apiSuccess {String} data.category Process category.
  * @apiSuccess {String} data.name Process name.
  * @apiSuccess {Number} data.status Process status, [0/running, 1/success, 2/failed].
  * @apiSuccess {Timestamp} data.createdAt Process createdAt.
  * @apiSuccess {Object[]} data.list Process logs.
  * @apiSuccess {Timestamp} data.list.createdAt Process createdAt.
  * @apiSuccess {String} data.list.level Process logs level.
  * @apiSuccess {String} data.list.content Process logs content.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "pagination": {
          "total": 100,
          "start": 0,
          "limit": 10
        },
        "pid": "262bb9a0-3c66-11e7-8852-6fe3d7b3a269",
        "handle": "create",
        "category": "cluster",
        "name": "aliyunDemo",
        "status": 0,
        "createdAt": 1495179508000,
        "list": [{
          "createdAt": 1495179508000,
          "level": "DEBUG",
          "content": "hello, this is test message."
        }, {
          "createdAt": 1495179508000,
          "level": "INFO",
          "content": "hello, this is product message."
        }, {
          "createdAt": 1495179508000,
          "level": "ERROR",
          "content": "Create cluster failed"
        }]
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/
const get = async (ctx, next) => {
  const limit = ctx.query.limit ? toNumber(ctx.query.limit) : undefined
  const start = toNumber(ctx.query.start || 0)
  const pid = ctx.params.pid
  const order = [['createdAt', 'ASC'], ['rank', 'ASC']]
  try {
    const pro = await checkProcessExist({ ctx, pid })

    const where = { processId: pid }

    let { exclude } = ctx.query
    if (exclude) {
      exclude = (exclude || '').toUpperCase()
      const levels = exclude.split(',').map((l) => l.trim())
      if (levels.length) where.level = { [Op.notIn]: levels }
    }

    const { count, rows } = await Log.findAndCountAll({
      where,
      limit,
      offset: start,
      order
    })

    const data = processFormat(pro)
    data.pagination = { total: count, limit, start: start + limit }
    data.list = rows.map((log) => logFormat(log))

    ctx.body = data
  } catch (e) {
    throw e
  }
}

/**
  * @api {post} /processes POST_PROCESSES
  * @apiName POST_PROCESSES_PID
  * @apiGroup Processes
  *
  * @apiParam {String} pid Process unique id.
  * @apiParamExample {json} Request-Example:
    {
      "handle": "install",
      "category": "application",
      "name": "koala-test"
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object} data.pid Process unique id.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "pid": "262bb9a0-3c66-11e7-8852-6fe3d7b3a269"
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/
const create = async (ctx) => {
  const {
    handle,
    category,
    name,
    status = 0,
    pid = uuid(),
    serviceName = config.get('APP_NAME')
  } = ctx.request.body

  if (!(handle && category && name)) {
    throw new ApiError(ApiErrorNames.PARAMS_ERROR)
  }

  try {
    await Process.create({
      handle,
      serviceName,
      category,
      name,
      pid,
      userId: ctx.state?.user?.userName || 'system',
      status
    })

    ctx.body = { pid }
  } catch (e) {
    throw e
  }
}

/**
  * @api {put} /processes/:pid/status PUT_PROCESSES_STATUS
  * @apiName PUT_PROCESSES_STATUS
  * @apiGroup Processes
  *
  * @apiParam {String} pid Process unique id.
  * @apiParamExample {json} Request-Example:
    {
      "pid": "58d9d5d6ae4908076eb16cfe",
      "status": "0"
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object} data.pid Process unique id.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "pid": "262bb9a0-3c66-11e7-8852-6fe3d7b3a269"
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/
const updateStatus = async (ctx) => {
  const { status } = ctx.request.body
  const pid = ctx.params.pid

  try {
    const pro = await checkProcessExist({ ctx, pid })
    await pro.update({ status: toNumber(status) })
    ctx.body = { pid }
  } catch (e) {
    throw e
  }
}

module.exports = { get, create, updateStatus }
