const router = require('koa-router')()
const controller = require(global.CONTROLLERPATH + 'behavior')

// post user behavior
router.post('/', controller.postBehavior)

module.exports = router
