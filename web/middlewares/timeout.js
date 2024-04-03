module.exports = async (ctx, next) => {
  ctx.req.setTimeout(0)
  ctx.res.setTimeout(0)
  await next()
}
