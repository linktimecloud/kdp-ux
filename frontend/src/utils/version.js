import semver from 'semver'

/**
 * Semver
 * https://github.com/npm/node-semver/blob/master/README.md
 */

export const versionFormat = (version = '') => semver.coerce(version)

export const versionValid = (version = '') => semver.valid(version)

export const versionCompare = (version = '', oldVersion = '') => {
  const v = versionFormat(version)
  const o = versionFormat(oldVersion)

  if (!versionValid(v) || !versionValid(o)) {
    return false
  }

  let ret

  if (semver.gt(v, o)) {
    ret = 1
  } else if (semver.lt(v, o)) {
    ret = -1
  } else {
    ret = 0
  }

  return ret
}

// transform custom app version
export const transformVersion = ({ name, app, increase }) => {
  let ret = ''
  if (name) {
    if (app) {
      const v = app.version || ''
      const arr = v.split('.')
      let major = parseInt(arr[0]) || 1
      let sub = parseInt(arr[1]) || 0
      if (increase) {
        major++
        sub = 0
      } else {
        sub++
      }
      ret = [major, sub].join('.')
    } else {
      ret = '1.0'
    }
  }
  return ret
}
