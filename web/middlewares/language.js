const config = require('config')
const i18n = require(global.I18NPATH)
module.exports = () => async (ctx, next) => {
  const language =
    ctx.get('Accept-Language') || ctx.get('accept-language') || config.get('DEFAULT_LANGUAGE')
  await i18n.changeLanguage(language)
  ctx.state.language = language
  ctx.t = (...args) => {
    if (args.length === 1) {
      args.push({})
    }

    const argsWithLangOption = args.map(arg => {
      if (typeof arg === 'object' && !Array.isArray(arg)) {
        return { ...arg, lng: language }
      }
      return arg
    })

    return i18n.t(...argsWithLangOption)
  }
  await next()
}
