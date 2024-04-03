// auto middlewares
const validate = require('./validate').valid
const timeout = require('./timeout')
const formatter = require('./formatter')
const healthcheck = require('./healthcheck')
const language = require('./language')
const proxy = require('./proxy')

module.exports = {
  validate,
  timeout,
  formatter,
  healthcheck,
  language,
  proxy
}
