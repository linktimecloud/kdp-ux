const logUtil = require(global.UTILPATH + 'log')

/**
  * @api {post} /behavior POST_BEHAVIOR
  * @apiName POST_BEHAVIOR
  * @apiGroup Global
  *
  * @apiParam {Object} reqData The request data sent in the body of the HTTP request.
  * @apiParam {String} reqData.type The type of behavior.
  * @apiParam {String} reqData.name The name of behavior.
  * @apiParam {String} reqData.refer The refer of behavior.
  * @apiParam {String} reqData.path The path of behavior.
  * @apiParam {String} reqData.start The start time of behavior.
  * @apiParamExample {json} Request-Example:
    {
      "reqData": {
        "type": "path/action",
        "name": "ACTION_NAME/PATH_NAME",
        "refer": "https://test.cloud.com:3001/",
        "path": "/api/bdosetl/resourceManager"
      }
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "data": {},
      "status": "100000",
      "message": {
        "desc": "Success"
      }
    }
  *
*/
const postBehavior = async (ctx) => {
  const { reqData = {} } = ctx.request.body
  const { type = 'path' } = reqData

  reqData.start = reqData.start || new Date()

  try {
    logUtil.logBehavior(ctx, 0, type, reqData)
    ctx.body = { type }
  } catch (e) {
    throw e
  }
}

module.exports = { postBehavior }
