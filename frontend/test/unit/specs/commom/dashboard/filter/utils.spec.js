import {
  removeEmptyObjKey,
  isIndependendExpr,
  isLabelExprReady,
  fillEmptyWithDefault,
  isRequiredVarChange,
 } from '@/common/dashboard/filter/utils'

describe('dashboard filter utils', () => {

  describe('test removeEmptyObjKey', () => {
    test('fillEmptyWithDefault dose not change the origin reference ', () => {
      const obj = { namespace: 'admin', container: ''}
      removeEmptyObjKey(obj)
      expect(obj).toEqual({ namespace: 'admin', container: ''})
    })

    test('removeEmptyObjKey removes empty prpoerty', () => {
      expect(
        removeEmptyObjKey({a: '', b: 'b'})
      ).toEqual({b: 'b'})

      expect(
        removeEmptyObjKey({a: 0, b: 'b'})
      ).toEqual({a: 0, b: 'b'})
    })
  })

  describe('test isIndependendExpr', () => {
    test('isIndependendExpr is true when has no variable ', () => {
      expect(
        isIndependendExpr('namespace')
      ).toEqual(true)
    })

    test('isIndependendExpr is false when a variable ', () => {
      expect(
        isIndependendExpr('namespace=~"$namespace"')
      ).toEqual(false)
    })
  })

  describe('test isLabelExprReady', () => {
    test('isLabelExprReady is true when querystring do not need variables', () => {
      expect(
        isLabelExprReady('namespace', {})
      ).toEqual(true)

      expect(
        isLabelExprReady('sum(kube_pod_info{}) by (node)', {})
      ).toEqual(true)
    })

    test('isLabelExprReady is false when querystring need  variable and variable is empty', () => {
      expect(
        isLabelExprReady('namespace=~"$namespace"')
      ).toEqual(false)
    })

    test('isLabelExprReady is true when variables are enough for querystring ', () => {
      expect(
        isLabelExprReady('namespace=~"$namespace"', { namespace: 'admin' })
      ).toEqual(true)

      expect(
        isLabelExprReady('namespace=~"$namespace", container=$container', { namespace: 'admin', container: 'container' })
      ).toEqual(true)
    })


    test('isLabelExprReady is false when variables are not enough for querystring ', () => {
      expect(
        isLabelExprReady('namespace=~"$namespace"', {})
      ).toEqual(false)

      expect(
        isLabelExprReady('a=~"$a", b=~"$b"', { a: 1 })
      ).toEqual(false)
    })

    expect(
      isLabelExprReady('namespace=~"$namespace", container=$container', { namespace: 'admin'})
    ).toEqual(false)
  })

  describe('test fillEmptyWithDefault', () => {
    test('fillEmptyWithDefault dose not change the origin reference ', () => {
      const obj = { namespace: '', container: ''}
      fillEmptyWithDefault(obj, '.+')

      expect(obj).toEqual({ namespace: '', container: ''})
    })

    test('fillEmptyWithDefault fill obj[property] with defaultValue', () => {
      const obj = { namespace: '', container: ''}
      expect(
        fillEmptyWithDefault(obj, '.+')
      ).toEqual( { namespace: '.+', container: '.+'})
    })
  })

  describe('test isRequiredVarChange', () => {
    test('isRequiredVarChange: empty property dose not matter ', () => {
      const newFilter = { namespace: 'admin', pod: ''}
      const oldFilter = { namespace: 'admin', container: ''}

      expect(isRequiredVarChange({
        query: 'querystring',
        newFilter,
        oldFilter
      })).toBe(false)
    })

    test('isRequiredVarChange: if the var is not used by querystring, then it dosn\'t matter ', () => {
      const newFilter = { container: 'x' }
      const oldFilter = { container: 'y' }

      expect(isRequiredVarChange({
        query: 'namespace=~"$namespace"',
        newFilter,
        oldFilter
      })).toBe(false)
    })

    test('isRequiredVarChange: if var is used by querystring and changed, return true', () => {
      const newFilter = { namespace: 'xxxxx' }
      const oldFilter = { namespace: 'yyyyy' }


      expect(isRequiredVarChange({
        query: 'namespace=~"$namespace"',
        newFilter,
        oldFilter
      })).toBe(true)
    })

  })




})
