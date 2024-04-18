/* v8 ignore next 11 */
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

export const saveCsvFile = (data = [], fileName = '') => {
  if (!data.length) return
  const csv = Papa.unparse(data)
  const blob = new Blob(['\uFEFF' + csv], {type: 'blobType'})
  saveAs(blob, `${fileName || 'file'}.csv`)
}
