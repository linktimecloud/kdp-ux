const router = require('koa-router')()
const controller = require(global.CONTROLLERPATH + 'tutorial')

router.get('/tips', controller.getTutorialTips)

module.exports = router
