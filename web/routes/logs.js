const router = require('koa-router')()
const controller = require(global.CONTROLLERPATH + 'log')

router.post('/', controller.addLog)
router.put('/:lid', controller.updateLog)

// 供bpaas-core调用
router.post('/:actionId', controller.addLog)

module.exports = router
