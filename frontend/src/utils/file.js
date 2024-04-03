import Papa from 'papaparse'
import { saveAs } from 'file-saver'

export const getBase64 = /* istanbul ignore next */ (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export const base64ImageStr = (str = '', type = 'image/*') => {
  if (str.includes('base64,')) return str
  return `data:${type};base64,${str}`
}

// data = [{}, {}, ...]
export const saveCsvFile = /* istanbul ignore next */ (data = [], fileName = '') => {
  if (!data.length) return
  const csv = Papa.unparse(data)
  const blob = new Blob(['\uFEFF' + csv], {type: 'blobType'})
  saveAs(blob, `${fileName || 'file'}.csv`)
}
