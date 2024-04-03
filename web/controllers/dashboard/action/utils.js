const { isEmpty, toNumber, isUndefined, omitBy } = require('lodash')
const config = require('config')
const fetch = require('node-fetch')
const { t } = require(global.I18NPATH)

const { PROMETHEUS_SERVICE, LOKI_SERVICE } = config.get('METRICS_SERVICE')
const { ApiErrorNames, ApiError } = require(global.UTILPATH + 'error')

/**
 * api doc
 * loki: https://grafana.com/docs/loki/latest/api/#query-loki
 * prometheus: https://prometheus.io/docs/prometheus/latest/querying/api/
 */

const getServiceBase = (type = 'prometheus') => {
  const services = {
    loki: `${LOKI_SERVICE}/loki/api/v1`,
    prometheus: `${PROMETHEUS_SERVICE}/api/v1`
  }
  return services[type.toLowerCase()] || services.prometheus
}

const MS_TO_NS = 1000000
const MS_TO_S = 1 / 1000

const convertMsToNs = (ms) =>
  toNumber(ms) ? Math.round(toNumber(ms) * MS_TO_NS) : undefined
const convertMsToS = (ms) => (toNumber(ms) ? Math.round(toNumber(ms) * MS_TO_S) : undefined)
const convertNsToMS = (ns) =>
  toNumber(ns) ? Math.round(toNumber(ns) / MS_TO_NS) : undefined

const buildLokiQuery = (params) => {
  const time = convertMsToNs(params.time)
  const start = convertMsToNs(params.start)
  const end = convertMsToNs(params.end)

  delete params.interval

  const isQuery = params.query
  const queryParams = isQuery
    ? {
        direction: 'backward',
        step: params.step,
        limit: 5000,
        // loki 需要特殊处理，空格替换为 +
        query: encodeURIComponent(params.query).replace(/%20/g, '+')
      }
    : {}
  return {
    ...params,
    ...queryParams,
    time,
    start,
    end
  }
}

const buildPrometheusQuery = (params) => {
  const time = convertMsToS(params.time)
  const start = convertMsToS(params.start)
  const end = convertMsToS(params.end)

  return {
    ...params,
    time,
    start,
    end
  }
}

const QUERY_BUILDER = {
  loki: buildLokiQuery,
  prometheus: buildPrometheusQuery
}

const buildUrlQuery = (params, datasourceType) => {
  const parsedParams = omitBy(
    QUERY_BUILDER[datasourceType](params),
    isUndefined
  )
  // 不能使用 URLSearchParams, loki query 需要特殊处理空格
  return Object.keys(parsedParams).reduce((acc, key) => {
    const rawValue = parsedParams[key]
    const value =
      key === 'query' && datasourceType === 'loki'
        ? rawValue
        : encodeURIComponent(rawValue)
    return `${acc}${acc ? '&' : ''}${key}=${value}`
  }, '')
}

const parseData = ({ data, datasourceType }) => {
  if (datasourceType === 'prometheus') {
    return data
  }

  const { result = [] } = data || {}
  return result.reduce((acc, { stream, values }) => {
    return [
      ...acc,
      values.map((value) => ({
        labels: stream,
        tsNs: convertNsToMS(value[0]),
        time: convertNsToMS(value[0]),
        line: value[1]
      }))
    ]
  }, [])
}

const requestMetricService = async (datasourceType, { path, params }) => {
  const base = getServiceBase(datasourceType)
  const urlQuery = params ? buildUrlQuery(params, datasourceType) : ''
  const fetchUrl = `${base}/${path}?${urlQuery}`

  console.log('Fetching dashboard api =>', JSON.stringify({
    url: fetchUrl
  }))

  const resText = await fetch(fetchUrl)
    .then(rsp => rsp.text())

  const firstStr = (resText || '')[0]

  if (firstStr !== '{') {
    throw new ApiError(ApiErrorNames.LOKI_DATA_ERROR, {
      app: 'LOKI',
      description: t('error.lokiDataError', { resText }),
      exception: `${resText} when request to ${fetchUrl}`
    })
  }

  let rspJson

  try {
    rspJson = JSON.parse(resText)
  } catch (err) {
    // invalid json response
    // Unexpected token o in JSON at position 1
    console.log('query range error is:', err)

    throw new ApiError(ApiErrorNames.JSON_PARSE_ERROR, {
      exception: err.toString()
    })
  }

  const { status, data = {} } = rspJson

  // query 和 query_range 接口需要处理返回数据
  const isQuery = params.query

  return status === 'success' && isQuery && !params.raw
    ? parseData({ data, datasourceType })
    : { data }
}

const INTERNAL_VARIABLES = ({ start, end, interval }) => {
  const range = end - start
  return {
    __range: `${convertMsToS(range)}s`,
    __range_ms: range,
    __range_s: Math.ceil(convertMsToS(range)),
    __interval: interval
  }
}

const replaceVar = ({
  start,
  end,
  interval,
  query,
  scopedVars = {},
  variables,
  /**
   * TODO:UT
   * $namespace_$container
   * $namespace_container
   * $__range
   */
  regex = /\$((_*)[a-zA-Z]+(?:_[a-zA-Z]+)*)|\[\[([\s\S]+?)\]\]/g
}) => query.replace(regex, (matchedString, idx) => {
  const allVariables = {
    ...INTERNAL_VARIABLES({ start, end, interval }),
    ...variables
  }

  const variable = allVariables[idx]

  // 只要判断variables有这个key就直接替换，不管值是否为空
  if (allVariables.hasOwnProperty(idx)) {
    return variable
  }

  if (!isEmpty(scopedVars)) {
    const scopeVariable = scopedVars[idx]
    if (scopeVariable) {
      return scopeVariable.value
    }
  }

  return matchedString
})

module.exports = {
  replaceVar,
  convertMsToS,
  getServiceBase,
  requestMetricService
}
