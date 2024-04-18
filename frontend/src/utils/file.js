import Papa from 'papaparse'
import { saveAs } from 'file-saver'

// data = [{}, {}, ...]
export const saveCsvFile = /* istanbul ignore next */ (data = [], fileName = '') => {
  if (!data.length) return
  const csv = Papa.unparse(data)
  const blob = new Blob(['\uFEFF' + csv], {type: 'blobType'})
  saveAs(blob, `${fileName || 'file'}.csv`)
}
