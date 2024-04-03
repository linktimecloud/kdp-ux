const router = require('koa-router')()

router.get('/', async ctx => {
  ctx.body = ctx.state.user
})

module.exports = router
