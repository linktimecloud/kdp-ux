import { isEmpty, isEqual } from 'lodash'

export const removeEmptyObjKey = (obj = {}) => {
  const ret = Object.keys(obj).reduce((memo, k) => {
    if (obj[k] || obj[k] === 0) {
      memo[k] = obj[k]
    }

    return memo
  }, {})

  return isEmpty(ret) ? {} : ret
}

export const isIndependendExpr = (query) => {
  const reg = /\w+=~\\?"\$\w+\\?",?/g
  return !query.match(reg)
}

export const isLabelExprReady = (queryString, variables) => {
  const queryKeys = (queryString.match(/\$\w+\b/g) || []).map(s => s.replace(/^\$/, ''))

  if (!queryKeys.length) {
    return true
  }

  // 没有提供完整的 variables

  if (!variables) {
    return false
  }

  if (queryKeys.length > Object.keys(variables).length) {
    return false
  }

  return queryKeys.every(k => !!variables[k])
}

export const fillEmptyWithDefault = (obj, deafultValue) => {
  return Object.keys(obj).reduce((memo, k) => {
    memo[k] = obj[k] || deafultValue
    return memo
  }, {})
}

export const isRequiredVarChange = ({ query = '', newFilter = {}, oldFilter = {} }) => {
  const newVars = removeEmptyObjKey(newFilter)
  const oldVars = removeEmptyObjKey(oldFilter)

  if (isEqual(newVars, oldVars)) {
    return false
  }

  // query里 用到了这个变量，才是有效的
  const getEffectiveVars = (query, vars) => {
    return Object.keys(vars).reduce((memo, k) => {
      if (query.includes(`${k}=~"$${k}"`)) {
        memo[k] = vars[k]
      }

      return memo
    }, {})
  }

  const effectiveNewVars = getEffectiveVars(query, newVars)
  const effectiveOldVars = getEffectiveVars(query, oldVars)

  return !isEqual(effectiveNewVars, effectiveOldVars)
}
