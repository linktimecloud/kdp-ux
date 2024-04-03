const { capitalize } = require('lodash')
const { replaceVar, requestMetricService } = require('./utils')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')

/**
  * @api {post} /dashboard/queryrange
  * @apiName POST_DASHBOARD_QUERY_RANGE
  * @apiGroup Dashboard
  * @apiPermission Authorization User
  *
  * @apiParam {null} null no params.
  * @apiParamExample {json} Request-Example:
    {
      "start": "12333384443",
      "end": "12333384443",
      "targets": [
        {
          "expr": "up",
          "datasourceType": "prometheus",
          "interval": "1m"
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
        "result": [],
        "resultType": "matrix"
      },
      "message": {
        "desc": "Success"
      }
    }
  *
*/

/**
 * Prometheus https://prometheus.io/docs/prometheus/latest/querying/api/
 * query=<string>: Prometheus expression query string.
 * start=<rfc3339 | unix_timestamp>: Start timestamp, inclusive.
 * end=<rfc3339 | unix_timestamp>: End timestamp, inclusive.
 * step=<duration | float>: Query resolution step width in duration format or float number of seconds.
 * timeout=<duration>: Evaluation timeout. Optional. Defaults to and is capped by the value of the -query.timeout flag.
 */

/**
 * Loki https://grafana.com/docs/loki/latest/api/#query-loki-over-a-range-of-time
 * query: The LogQL query to perform
 * start: The start time for the query as a nanosecond Unix epoch or another supported format. Defaults to one hour ago.
 * end: The end time for the query as a nanosecond Unix epoch or another supported format. Defaults to now.
 * step: Query resolution step width in duration format or float number of seconds. duration refers to Prometheus duration strings of the form [0-9]+[smhdwy]. For example, 5m refers to a duration of 5 minutes. Defaults to a dynamic value based on start and end. Only applies to query types which produce a matrix response.
 * interval: This parameter is experimental; see the explanation under Step versus interval. Only return entries at (or greater than) the specified interval, can be a duration format or float number of seconds. Only applies to queries which produce a stream response.
 */

module.exports = async (ctx, next) => {
  const {
    start,
    end,
    targets,
    variables
  } = ctx.request.body

  try {
    const data = await Promise.all(
      targets.map(
        (
          { raw, refId, datasourceType, expr: rawQuery, interval = '1m', step = 10 },
          index
        ) => {
          const query = rawQuery.includes('$')
            ? replaceVar({ start, end, interval, query: rawQuery, variables })
            : rawQuery

          // 调用loki 不需要带step参数：Jira BPAAS-2207
          const params = { start, end, query, interval, raw }
          if (datasourceType !== 'loki') {
            params.step = step
          }

          return requestMetricService(datasourceType, {
            path: 'query_range',
            params,
            raw
          }).then((data) => ({ ...data, refId: refId || index }))
        }
      )
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
