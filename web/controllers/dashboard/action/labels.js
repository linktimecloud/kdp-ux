const { isNil, uniq, isArray } = require('lodash')
const { replaceVar, requestMetricService } = require('./utils')

/**
  * @api {post} /dashboard/labels POST_DASHBOARD_QUERY
  * @apiName POST_DASHBOARD_QUERY
  * @apiGroup Dashboard
  * @apiPermission Authorization User
  *
  * @apiParam {Number} start The start time of query.
  * @apiParam {Number} end The end time of query.
  * @apiParam {String} expr The expression of query.
  * @apiParam {String} label The label of query.
  * @apiParam {String} datasourceType The type of datasource.
  * @apiParam {String} reqLabelName The label name of query.
  * @apiParam {Object} variables The variables of query.
  * @apiParamExample {json} Request-Example:
    {
      "start": 1542211200,
      "end": 1542297600,
      "expr": "up",
      "label": "job",
      "variables": {},
      "datasourceType": "prometheus",
      "reqLabelName": "job"
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
  const {
    start,
    end,
    expr: rawExpr,
    label = '',
    variables = {},
    datasourceType,
    reqLabelName
  } = ctx.request.body

  const expr = rawExpr.includes('$')
    ? replaceVar({ query: rawExpr, variables })
    : rawExpr

  // 以 {} 围绕的 expr 则调用 series 接口
  const isSeries = /^{.*}$/.test(rawExpr) && !reqLabelName

  // 如果reqLabelName有值，则表示直接调用 label 接口，并且把expr放到match参数中进行过滤（因为这个接口耗时较短，series接口非常慢）
  const labelParams = {
    start,
    end
  }
  if (reqLabelName) {
    labelParams['match[]'] = expr
  }

  const fetchLabels = isSeries
    ? requestMetricService(datasourceType, {
      path: 'series',
      params: { start, end, 'match[]': [expr] }
    })
    : requestMetricService(datasourceType, {
      path: `label/${reqLabelName || expr}/values`,
      params: labelParams
    })
  try {
    const { data } = await fetchLabels
    const shouldExtractLabel = isSeries && label

    const list = isArray(data) ? data : []

    const d = list
      .map((item) => shouldExtractLabel ? item[label] : item)
      .filter((item) => !isNil(item))

    ctx.body = shouldExtractLabel ? uniq(d) : d
  } catch (e) {
    throw e
  }
}
