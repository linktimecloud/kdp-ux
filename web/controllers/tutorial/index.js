const path = require('path')
const { readFileSync, existsSync } = require('fs')

const { get } = require('lodash')

const { ApiErrorNames, ApiError } = require(path.join(global.UTILPATH, 'error'))
const logUtil = require(global.UTILPATH + 'log')

const getTutorialTips = async (ctx) => {
  try {
    const { customizePath, keys, lang = 'zh' } = ctx.query

    if (!keys) {
      throw new ApiError(ApiErrorNames.PARAMS_ERROR)
    }

    const keyList = keys.split(',')

    const tipsPath = path.join(
      global.ROOTPATH,
      'tutorial',
      'tips'
    )

    const mapping = JSON.parse(readFileSync(`${tipsPath}/map.json`, 'utf8'))

    const ret = {}
    keyList.forEach(item => {
      const path = get(mapping[item], 'path')
      const mainPath = customizePath ? `${tipsPath}/${path}/${customizePath}` : `${tipsPath}/${path}`

      let filePath = `${mainPath}.md`
      if (lang === 'en') {
        filePath = existsSync(`${mainPath}.en.md`) ? `${mainPath}.en.md` : `${mainPath}.md`
      }

      const isExist = existsSync(filePath)
      if (isExist) {
        const data = {
          ...mapping[item],
          content: readFileSync(filePath, 'utf8') || ''
        }
        ret[item] = data
      } else {
        logUtil.logRawError(ctx, {
          message: `Tips ${item}: ${filePath} does not exist !`
        })
        ret[item] = { content: '' }
      }
    })

    ctx.body = keyList.length === 1 ? ret[keyList[0]] : ret
  } catch (e) {
    console.log('GET_TUTORIAL_TIPS throws an error ...', e)
    throw e
  }
}

module.exports = {
  getTutorialTips
}
