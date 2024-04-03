const config = require('config')

const valid = async (ctx, next) => {
  ctx.state.user = {
    ...config.get('LOCAL_USER')
  }

  await next()
}

module.exports = { valid }
