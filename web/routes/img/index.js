const path = require('path')
const router = require('koa-router')()

const { encodeIcon, existsFile } = require(path.join(global.UTILPATH, 'file'))

router.get('/', async (ctx) => {
  const { name = '' } = ctx.query
  try {
    let imagePath = path.join(global.LIBPATH, 'resource', 'appIcon', `${name}.png`)

    if (!existsFile(imagePath)) {
      imagePath = path.join(global.LIBPATH, 'resource', 'appIcon', 'default.png')
    }

    const imageFile = await encodeIcon(imagePath)
    const image = Buffer.from(imageFile, 'base64')

    ctx.set({
      'Content-Length': image.length,
      'Content-Type': 'image/*',
      'Cache-Control': 'public, max-age=2592000',
      Expires: new Date(Date.now() + 2592000000).toUTCString()
    })
    ctx.status = 200
    ctx.body = image
  } catch (e) {
    throw e
  }
})

module.exports = router
