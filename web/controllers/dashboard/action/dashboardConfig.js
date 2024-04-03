const path = require('path')
const { readFileSync, existsSync } = require('fs')
const config = require('config')
const { PROMETHEUS_SERVICE } = config.get('METRICS_SERVICE')
const axios = require('axios')

/**
  * @api {get} /dashboard/config POST_DASHBOARD_QUERY
  * @apiName POST_DASHBOARD_QUERY
  * @apiGroup Dashboard
  * @apiPermission Authorization User
  *
  * @apiParam {String} name The name of dashboard config.
  * @apiParamExample {json} Request-Example:
    {
      "name": "sample"
    }
  *
  * @apiSuccess {String} status Status code.
  * @apiSuccess {Object} data Data result.
  * @apiSuccess {Object} message Descrpition within status code.
  * @apiSuccessExample {json} Success-Response:
  * {
      "status": "100000",
      "data": {
        "panels": [],
        "templating": {}
      },
      "message": {
        "desc": "Success"
      }
    }
*/

module.exports = async (ctx, next) => {
  const { name = 'sample' } = ctx.request.query
  let config = {}
  let prometheusHealth = true
  try {
    await axios({
      url: `${PROMETHEUS_SERVICE}/api/v1/query`
    }).then(data => {}).catch(e => {
      prometheusHealth = !!e?.response
    })

    const filePath = path.join(global.CONSTANTPATH, 'dashboard', `${name}.json`)
    if (existsSync(filePath)) {
      const str = readFileSync(filePath, { encoding: 'utf-8' })
      config = JSON.parse(str)
    }

    ctx.body = {
      ...config,
      prometheusHealth
    }
  } catch (e) {
    throw e
  }
}
