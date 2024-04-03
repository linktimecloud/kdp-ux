const router = require('koa-router')()
const controller = require(global.CONTROLLERPATH + 'dashboard')

router.post('/labels', controller.labels)

router.post('/query', controller.query)

router.post('/queryrange', controller.queryRange)

router.get('/config', controller.dashboardConfig)

module.exports = router
