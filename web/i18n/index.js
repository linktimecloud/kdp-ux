const path = require('path')
const fs = require('fs')
const config = require('config')
const i18next = require('i18next')

const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (e) {
    console.error(`read json path ${filePath} failed`, e)
    return {}
  }
}

const NS = ['common', 'error']
const baseLocalePath = path.join(global.I18NPATH, 'locales')
/**
 * resources: {
 *    en: {
 *      common: {
 *        key: 'hello from namespace 1'
 *      },
 *      error: {
 *        key: 'hello from namespace 2'
 *      }
 *    },
 *    de: {
 *      common: {
 *        key: 'hallo von namespace 1'
 *      },
 *      error: {
 *        key: 'hallo von namespace 2'
 *      }
 *    }
 *  }
 */
const resources = fs.readdirSync(baseLocalePath).reduce((acc, lang) => {
  acc[lang] = NS.reduce((acc, ns) => {
    acc[ns] = readJSON(`${baseLocalePath}/${lang}/${ns}.json`)
    return acc
  }, {})
  return acc
}, {})

// Documentation: https://www.i18next.com/overview/api
i18next.init({
  fallbackLng: config.get('DEFAULT_LANGUAGE'),
  nsSeparator: '.',
  ns: NS,
  // debug: process.env.NODE_ENV === 'development',
  debug: false,
  load: 'languageOnly',
  preload: true,
  returnEmptyString: false,
  resources
})

module.exports = i18next
