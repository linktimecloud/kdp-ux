const moment = require('moment')
const { toNumber } = require('lodash')
const { Op, Process } = require(global.MODELPATH)
const { processFormat } = require(global.UTILPATH + 'format')

/**
  * @api {get} /processes GET_PROCESSES
  * @apiName GET_PROCESSES
  * @apiGroup Processes
  *
  * @apiParam {Number} total Process total number.
  * @apiParam {Number} limit Process limit number.
  * @apiParam {Number} start Process start number.
  * @apiParam {String} category Process category.
  * @apiParam {String} handle Process handle.
  * @apiParam {String} name Process name.
  * @apiParam {Number} status Process status.
  * @apiParam {String} userId Process userId, multiple values separated by commas.
  * @apiParam {String} gid The gid of the process's user, the process list of all users under this group will be queried.

  * @apiParamExample {json} Request-Example:
    {
      "total": 100,
      "limit": 10,
      "start": 20
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object[]} data.list Process list.
  * @apiSuccess {String} data.list.pid Process unique id.
  * @apiSuccess {String} data.list.handle Process handle.
  * @apiSuccess {String} data.list.category Process category.
  * @apiSuccess {String} data.list.name Process name.
  * @apiSuccess {String} data.list.user Process user name.
  * @apiSuccess {Number} data.list.status Process status, [0/running, 1/success, 2/failed].
  * @apiSuccess {Timestamp} data.list.createdAt Process createdAt.
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
        "list": [
          {
            "pid": "262bb9a0-3c66-11e7-8852-6fe3d7b3a269",
            "handle": "create",
            "category": "cluster",
            "name": "aliyunDemo",
            "status": 0,
            "user": "admin",
            "createdAt": 1495179508000,
            "updatedAt": 1495179508000
          },
          {
            "pid": "262bb9a0-3c66-11e7-8852-6fe3d7b3a269",
            "handle": "create",
            "category": "cluster",
            "name": "aliyunDemo",
            "status": 0,
            "user": "admin",
            "createdAt": 1495179508000,
            "updatedAt": 1495179508000
          }
        ]
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/
const processes = async (ctx, next) => {
  const limit = toNumber(ctx.query.limit || 100)
  const start = toNumber(ctx.query.start || 0)
  const order = [['createdAt', 'DESC']]

  try {
    const oneHourAgo = moment()
      .subtract(1, 'hours')
      .format('YYYY-MM-DD HH:mm:ss')

    await Process.update(
      { status: 2 },
      { where: { status: 0, createdAt: { [Op.lt]: new Date(oneHourAgo) } } }
    )

    let where = {}

    if (ctx.query.handle) {
      where.handle = ctx.query.handle
    }

    const filters = ['category', 'name', 'status'].reduce((acc, key) => {
      const query = ctx.query[key] && ctx.query[key].trim()
      if (query) {
        // Treat comma separated value as mutiple options
        const arr =
          key === 'status'
            ? query.split(',').map((item) => parseInt(item))
            : query.split(',')
        const q = key === 'status' ? parseInt(query) : query

        acc[key] = query.includes(',')
          ? { [Op.in]: arr }
          : { [Op.like]: `%${q}%` }
      }
      return acc
    }, {})

    where = {
      ...where,
      ...filters,
      ...getTimeFilter(ctx.query)
    }

    const { count, rows } = await Process.findAndCountAll({
      where,
      limit,
      offset: start,
      order
    })

    const list = rows.map((row) => processFormat(row))
    const pagination = { total: count, limit, start }
    ctx.body = { pagination, list }
  } catch (e) {
    throw e
  }
}

const getTimeFilter = (queryObj) => {
  if (!queryObj || !queryObj.startTime || !queryObj.endTime) {
    return {}
  }

  return {
    createdAt: {
      [Op.lt]: parseInt(queryObj.endTime),
      [Op.gt]: parseInt(queryObj.startTime)
    }
  }
}

module.exports = { processes }
