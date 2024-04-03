const { omitBy, isNil } = require('lodash')
const { v4: uuid } = require('uuid')
const { Log } = require(global.MODELPATH)
const { checkProcessExist } = require(global.UTILPATH + 'utils')

/**
  * @api {post} /logs Add Log
  * @apiName AddLog
  * @apiGroup Log
  *
  * @apiParam {String} [lid] Unique Log ID.
  * @apiParam {String} content Log's content.
  * @apiParam {String} level Log's level.
  * @apiParam {Number} rank Log's rank.
  * @apiParam {Number} processId The ID of the related process.
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {String} data.lid Logs lid.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "lid": 10
      },
      "message": "Success"
    }
  *
 */

const addLog = async (ctx) => {
  const { lid = uuid(), content, level, rank } = ctx.request.body || {}
  const processId = ctx.params.actionId || ctx.request.body.processId || ''

  await checkProcessExist({ ctx, pid: processId })

  // Log level should be enum value
  await Log.create({
    lid,
    processId,
    level,
    content,
    rank
  })

  ctx.body = {
    lid
  }
}

/**
  * @api {put} /logs/:lid Update Log
  * @apiName UpdateLog
  * @apiGroup Log
  *
  * @apiParam {String} lid Unique Log ID in URL path.
  * @apiParam {String} [content] New content of the log, if you want to update it.
  * @apiParam {String} [level] New level of the log, if you want to update it.
  * @apiParam {Number} [rank] New rank of the log, if you want to update it.
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {String} data.lid Logs lid.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "lid": 10
      },
      "message": "Success"
    }
  *
 */

const updateLog = async (ctx) => {
  const { lid } = ctx.request.params
  const { content, level, rank } = ctx.request.body

  const data = omitBy(
    {
      content,
      level,
      rank
    },
    isNil
  )

  Log.update(data, { where: { lid } })

  ctx.body = {
    lid
  }
}

module.exports = {
  addLog,
  updateLog
}
