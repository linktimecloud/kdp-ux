const path = require('path')
const config = require('config')

const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const json = require('koa-json')()
const { koaBody } = require('koa-body')
const logger = require('koa-logger')('bdos')
const cors = require('kcors')
const serve = require('koa-static')
const compress = require('koa-compress')()
const compose = require('koa-compose')

const port = config.get('PORT') || 3300
const maxage = config.get('MAX_AGE') || 0

// global path
global.ROOTPATH = path.join(__dirname, '/')
global.LIBPATH = path.join(__dirname, 'lib', '/')
global.UTILPATH = path.join(__dirname, 'lib', 'util', '/')
global.CONSTANTPATH = path.join(__dirname, 'constant', '/')
global.CONTROLLERPATH = path.join(__dirname, 'controllers', '/')
global.MIDDLEWAREPATH = path.join(__dirname, 'middlewares', '/')
global.MODELPATH = path.join(__dirname, 'models', '/')
global.I18NPATH = path.join(__dirname, 'i18n', '/')

const isTest = process.NODE_ENV === 'test'

// WebUI status code
global.WEBUI_SUCCESS_CODE = '100000'

const { validate, timeout, proxy, formatter, healthcheck, language } = require(global.MIDDLEWAREPATH)

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log('NODE API ERROR:', JSON.stringify(err.message))
    ctx.status = err.status || 500
    ctx.body = err.message
  }
})

app.use(healthcheck())
app.use(language())
// auto middlewares

app.use(async (ctx, next) => {
  ctx.compress = !new RegExp(/\/api\.*/gi).test(ctx.url)
  await next()
})
app.use(compress)

app.use(
  compose([
    serve('public', { maxage }),
    cors({
      allowHeaders: ['Access', 'Accept', 'Authorization', 'Content-Type']
    }),
    json,
    logger
  ])
)

// feedback config
const feedback = (err, options) => {
  console.log('Reported error: ', { options, err })
}

// logger
try {
  const logUtil = require(global.UTILPATH + 'log')
  app.use(async (ctx, next) => {
    const start = new Date()
    let ms
    try {
      await next()
      ms = new Date() - start
      logUtil.logResponse(ctx, ms)
    } catch (err) {
      ms = new Date() - start
      logUtil.logError(ctx, err, ms)
      feedback(err, { type: 'request', url: ctx.url })
    } finally {
      logUtil.logBehavior(ctx, ms, 'api', { start })
    }
  })
} catch (err) {
  feedback(err, { type: 'logError' })
}

// manual middlewares
try {
  app.use(
    compose([
      validate,
      timeout,
      koaBody({
        formLimit: '1gb',
        multipart: true,
        parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET'],
        onError: (err) =>
          console.log('Middleware: Koa-Body throws an Error', err),
        formidable: {
          maxFileSize: 1000 * 1024 * 1024
        }
      }),
      proxy,
      formatter('^/api')
    ])
  )
} catch (err) {
  feedback(err, { type: 'middlewaresError' })
}

// reload routes
try {
  const api = require('./routes/api')
  const img = require('./routes/img')
  router.use('/api', api.routes(), api.allowedMethods())
  router.use('/img', img.routes(), img.allowedMethods())
  app.use(router.routes(), router.allowedMethods())
} catch (err) {
  feedback(err, { type: 'routesError' })
}

// error
app.on('error', (err, ctx) => {
  feedback(err, { type: 'frameworkError' })
})

// uncaughtException
process.on('uncaughtException', (err) => {
  feedback(err, { type: 'uncaughtException' })
})

// unhandledRejection
process.on('unhandledRejection', (reason, promise) => {
  feedback(reason, { type: 'unhandledRejection', promise })
})

if (!isTest) {
  // init schedulers
  const Scheduler = require(path.join(global.UTILPATH, 'schedulers', 'scheduler'))
  const { schedulerWorker } = require(path.join(
    global.UTILPATH,
    'schedulers',
    'worker'
  ))

  // start nihgtly scheduler
  const { NIGHTLY_CRON_SET } = config.get('CRON_SETS')
  Scheduler(NIGHTLY_CRON_SET, schedulerWorker('NIGHTLY')).start()
}

// start app
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
