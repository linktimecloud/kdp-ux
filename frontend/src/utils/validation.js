import { omit } from 'lodash'

export const validateEmptyFields = (form, excludedFields = []) => {
  if (typeof form === 'object') {
    const validationFields = omit(form, excludedFields)
    const vals = Object.values(validationFields)
    return !vals.some(isInvalidVal)
  }
}

export const isInvalidVal = val => val === null || val === undefined || val === ''
