// get variable of env
module.exports = (variable, constant) => {
  const env = process.env
  let val = env[variable] || constant
  // in case of some envs sent by python such as `True` or `False`
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true') {
      val = true
    } else if (val.toLowerCase() === 'false') {
      val = false
    }
  }
  return val
}
