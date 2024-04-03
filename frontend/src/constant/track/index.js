export const BDTJ_SCRIPT = (trackId) => `
var _hmt = _hmt || []
;(function () {
  var hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?${trackId}'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()
`
