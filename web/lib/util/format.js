const moment = require('moment')

// processInfo
const processFormat = (pro) => {
  pro = pro.toJSON()
  pro.createdAt = moment(pro.createdAt).valueOf()
  pro.updatedAt = moment(pro.updatedAt).valueOf()
  pro.status = pro.status || 0
  return pro
}

// logInfo
const logFormat = (log) => {
  log = log.toJSON()
  log.createdAt = moment(log.createdAt).valueOf()
  log.updatedAt = moment(log.updatedAt).valueOf()
  return log
}

module.exports = {
  processFormat,
  logFormat
}
