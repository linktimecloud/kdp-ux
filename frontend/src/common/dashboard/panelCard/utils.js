
// rspData to dataResults

import { isString, get, omit, uniq, orderBy } from 'lodash'

const podlogStdoutGraphFormatter = (rspData, targets) => {
  return targets.map((item, idx) => {
    const refId = item.refId
    const originResult = get(rspData[refId] || rspData[idx] || {}, 'data.result', [])

    // 对每个refId 即 count 和 disk， 按照POD把每个时间点的数据合并成一条

    if (!originResult || !originResult.length) {
      return {
        target: item,
        result: [],
        refId
      }
    }

    // originResult = [{metric: {}, values: [ [time,  value], [t, v], [t, v]...]}, {}, {}, ...]
    // originResult.length > 1 最终目的是要将 result.length 变为 1
    // 目标 result = [{metric: {}, values: [[], [], []...]}]

    if (originResult.length === 1) {
      return {
        target: item,
        result: originResult,
        refId
      }
    }

    const originAllValues = originResult.reduce((arr, cur) => {
      if (Array.isArray(cur.values)) {
        arr.push(...cur.values)
      }
      return arr
    }, [])

    //  originAllValues = [ [timestamp, v], [], [], ... ] 大量 timestamp 有重复

    // 提取所有的去重时间 并配上一个初始值 0
    const inital = uniq(originAllValues.map(item => item[0])).map(time => [time, 0])
    //  inital = [[time1, 0], [time2, 0], ...]

    const values = originAllValues.reduce((memo, values) => {
      const memoItem = memo.find(item => item[0] === values[0])
      // memoItem = [time, count]

      memoItem[1] = parseInt(memoItem[1]) + parseInt(values[1])
      return memo
    }, inital)
    //  values = [[time1, count1], [time2, count2], ...] 次数每个 time 都是唯一的，count值是该时间上加起来的总和值

    const result = [{ metric: {}, values }]
    return {
      target: item,
      result,
      refId
    }
  })
}

const podLogviewerStdLogsFormatter = (rspData) => {
  const dashboardData = rspData[0]
  if (!dashboardData[0]) {
    return []
  }

  const list = Object.keys(dashboardData).reduce(
    (memo, idx) => {
      if (idx === 'refId') {
        return memo
      }

      return memo.concat(dashboardData[idx])
    },
    []
  )

  return list.map(item => ({
    createdAt: item.tsNs,
    content: item.line,
    labels: item.labels
  }))
}

const HANDLERS = {
  DEFAULT: (rspData, targets) => {
    return targets.map((item, idx) => ({
      target: item,
      ...(rspData[item.refId] || rspData[idx] || {})
    }))
  },

  // 标准输出日志量统计 Table
  POD_LOG_STDOUT_TABLE: (rspData, targets) => {
    return targets.map((item, idx) => {
      const refId = item.refId
      const originResult = get(rspData[refId] || rspData[idx] || {}, 'data.result', [])

      // 对每个refId 即 count 和 disk， 按照 metric 把所有时间点的数据合并成一条
      const result = originResult.length
        ? originResult.reduce((memo, cur) => {
          const values = cur.values
          const ret = omit(cur, 'values')

          ret.value = values.reduce((acc, me) => {
            acc[1] = parseInt(acc[1]) + parseInt(me[1])
            return acc
          }, [values[0][0], 0])

          memo.push(ret)

          return memo
        }, [])
        : []

      return {
        target: item,
        result,
        refId
      }
    })
  },

  // 标准输出日志量统计 echart 图
  POD_LOG_STDOUT_GRAPH: podlogStdoutGraphFormatter,

  // 日志文件日志量统计 echart 图
  POD_LOG_LOGFILE_GRAPH: podlogStdoutGraphFormatter,

  // 错误日志量统计 echart 图
  POD_LOG_FILEERR_GRAPH: podlogStdoutGraphFormatter,

  // 错误日志内容
  POD_LOG_FILEERR_LOGS: (rspData) => {
    const raw = rspData[0]

    delete raw.refId

    const flattenedData = Object.values(raw).reduce((memo, cur) => {
      if (Array.isArray(cur)) {
        memo.push(...cur)
      }
      return memo
    }, [])

    const ret = flattenedData.map(item => ({
      labels: item.labels,
      content: item.line,
      createdAt: item.time
    }))

    return orderBy(ret, 'createdAt', 'desc')
  },

  POD_LOGVIEWER_STD_LOGS: podLogviewerStdLogsFormatter,
  POD_LOGVIEWER_FILE_LOGS: podLogviewerStdLogsFormatter
}

export const rawToDataResults = (rspData, targets, customFormat) => {
  const key = (customFormat && isString(customFormat)) ? customFormat.toUpperCase() : 'DEFAULT'
  const handler = HANDLERS[key]

  return handler(rspData, targets)
}
