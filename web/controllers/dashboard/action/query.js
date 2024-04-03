const { capitalize } = require('lodash')
const { replaceVar, requestMetricService } = require('./utils')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')

/**
  * @api {post} /dashboard/query
  * @apiName POST_DASHBOARD_QUERY
  * @apiGroup Dashboard
  * @apiPermission Authorization User
  *
  * @apiParam {null} null no params.
  * @apiParamExample {json} Request-Example:
    {
      "time": "12333384443",
      "targets": [
        {
          "expr": "up",
          "datasourceType": "prometheus",
        }
      ],
      "variables": {
        a: 1,
        b: 2
      }
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {String} data.buttonId Course Button unique id.
  * @apiSuccess {String} data.courseId Course id.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccess {String} message.desc Detail descrption.
  *
  * @apiSuccessExample {json} Success-Response:
    {
      "status": "100000",
      "data": {
        "buttonId": "95488840-f14b-11e8-bc33-e5d8a5a697b6",
        "courseId": "1fcfaf50-aa45-11e8-b27b-1f0eae91b0f5"
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/
module.exports = async (ctx, next) => {
  const { start, end, targets, time, variables = {} } = ctx.request.body

  try {
    const data = await Promise.all(
      targets.map(({ datasourceType, expr: rawQuery, refId, interval }, index) => {
        const query = rawQuery.includes('$')
          ? replaceVar({ query: rawQuery, variables, start, end, interval })
          : rawQuery
        return requestMetricService(datasourceType, {
          path: 'query',
          params: { time, query }
        }).then(data => ({ ...data, refId: refId || index }))
      })
    )

    ctx.body = data.reduce((acc, item) => {
      acc[item.refId] = item
      return acc
    }, {})
  } catch (e) {
    const serviceName = capitalize(targets[0]?.datasourceType) || 'Dashboard'
    throw new ApiError(ApiErrorNames.API_INTERNAL_ERROR, {
      description: `${serviceName}: ${e}`,
      solution: ctx.t('error.pleaseCheckSpecifiedServiceStatus', { name: serviceName }),
      type: 'warning'
    })
  }
}
