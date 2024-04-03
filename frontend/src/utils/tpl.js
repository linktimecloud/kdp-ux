import Mustache from 'mustache'

export default (str = '', map) => {
  let ret = str
  try {
    ret = Mustache.render(str, map)
  } catch (e) {
    console.error(e)
  }
  return ret
}
