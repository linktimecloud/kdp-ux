const router = require('koa-router')()
const controller = require(global.CONTROLLERPATH + 'processes')

router.get('/', controller.getProcesses)

router.get('/:pid', controller.getProcessById)

router.post('/', controller.createProcess)

router.put('/:pid/status', controller.updateStatus)

module.exports = router
