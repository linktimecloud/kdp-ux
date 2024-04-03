const router = require('koa-router')()

/**
 * @api {get} / index
 * @apiParamExample {json} Request-Example:
 *     {}
 * @apiName Root
 * @apiGroup Index
 *
 * @apiParam {null} null No params.
 *
 * @apiSuccess {String} status Six digital code of status.
 * @apiSuccess {Object} data Result of user list.
 * @apiSuccess {Object} message Descrpition within status code.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       status: '1000000',
 *       data: {title: 'Hello bdos Cloud'},
 *       message: {desc: "Sucess"}
 *     }
 */
router.get('/', (ctx, next) => {
  ctx.body = { status: 1 }
})

router.post('/', (ctx, next) => {
  ctx.body = { status: 1 }
})

module.exports = router
