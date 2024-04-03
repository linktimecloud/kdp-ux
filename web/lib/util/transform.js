// transformer
module.exports = {
  // string -> number
  string2number: (str) => {
    if (typeof str === 'string') {
      str = Number(str)
    }
    return str
  }
}
