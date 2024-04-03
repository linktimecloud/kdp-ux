import { API_BASE } from '@/env'

export const download = (key, name = 'unknown_file', domain = API_BASE) => {
  const href = domain + 'file?key=' + key
  let a = document.getElementById('download_file')
  if (!a) {
    a = document.createElement('a')
    document.body.appendChild(a)
  }
  a.setAttribute('id', 'download_file')
  a.setAttribute('href', href)
  a.setAttribute('download', name)
  a.click()
}

export const downloadAsJson = (content = {}, fileName = 'unknown_file.json') => {
  const eleLink = document.createElement('a')
  eleLink.download = `${fileName}.json`
  eleLink.style.display = 'none'
  const data = JSON.stringify(content, null, 2)
  const blob = new Blob([data], { type: 'text/json' })
  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}
