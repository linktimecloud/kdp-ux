const { sequelize } = require(global.MODELPATH)

const LIVENESS_PATH = '/liveness'
const READINESS_PATH = '/readiness'
const SUCCESS_STATUS = 200
const FAILURE_STATUS = 500

module.exports = () => async (ctx, next) => {
  if (ctx.path === LIVENESS_PATH) {
    ctx.body = {
      uptime: process.uptime()
    }
    ctx.status = SUCCESS_STATUS
    return
  }

  if (ctx.path === READINESS_PATH) {
    try {
      const testDatabase = await sequelize.query('SELECT 1')

      ctx.body = {
        databaseReady: typeof testDatabase === 'object'
      }
      ctx.status = SUCCESS_STATUS
    } catch (e) {
      ctx.body = {
        databaseReady: false
      }
      ctx.status = FAILURE_STATUS
    }
    return
  }

  await next()
}
