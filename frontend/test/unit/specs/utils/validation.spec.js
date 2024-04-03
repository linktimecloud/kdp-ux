import { validateEmptyFields, isInvalidVal } from '@/utils/validation'

describe('Validation', () => {
  test(
    'validateEmptyFields should return false if the form has empty fields',
    () => {
      const form = {
        a: '',
        b: '123'
      }
      expect(validateEmptyFields(form)).toBe(false)
    }
  )
  test(
    'validateEmptyFields should return false if the form has null value fields',
    () => {
      const form = {
        a: null,
        b: '123'
      }
      expect(validateEmptyFields(form)).toBe(false)
    }
  )
  test(
    'validateEmptyFields should return false if the form has undefined value fields',
    () => {
      const form = {
        a: undefined,
        b: '123'
      }
      expect(validateEmptyFields(form)).toBe(false)
    }
  )
  test(
    'validateEmptyFields should return true if the form\' all fields has been filled',
    () => {
      const form = {
        a: 'test',
        b: '123'
      }
      expect(validateEmptyFields(form)).toBe(true)
    }
  )
  test(
    'validateEmptyFields should return true if the form\' all fields has been filled, given some fields are excluded from validation',
    () => {
      const form = {
        a: 'test',
        b: '123',
        c: null,
        d: '',
        e: undefined
      }
      expect(validateEmptyFields(form, ['c', 'd', 'e'])).toBe(true)
    }
  )
  test(
    'isInvalidVal should return true if the value is null, undefined or empty string',
    () => {
      expect(isInvalidVal('')).toBe(true)
      expect(isInvalidVal(null)).toBe(true)
      expect(isInvalidVal(undefined)).toBe(true)
    }
  )
})
