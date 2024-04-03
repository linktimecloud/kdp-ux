const config = require('config')

// full path of error log
const errorLogPath = config.get('BASEPATH') + config.get('LOGPATH').error
// full path of response log
const responseLogPath = config.get('BASEPATH') + config.get('LOGPATH').response

module.exports = {
  appenders: [
    // error log
    {
      category: 'errorLogger', // logger name
      type: 'dateFile', // logger type
      filename: errorLogPath, // logger path
      alwaysIncludePattern: true, // include pattern
      pattern: '-yyyy-MM-dd-hh.log' // pattern name
    },
    // response log
    {
      category: 'resLogger',
      type: 'dateFile',
      filename: responseLogPath,
      alwaysIncludePattern: true,
      pattern: '-yyyy-MM-dd-hh.log'
    }
  ],
  levels: {
    errorLogger: 'ERROR',
    resLogger: 'ALL'
  }
}
