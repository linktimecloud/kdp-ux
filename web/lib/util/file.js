const fs = require('fs')

const existsFile = (file) => {
  return fs.existsSync(file)
}

const encodeIcon = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (error, data) => {
      if (error) reject(error)
      resolve(data.toString('base64'))
    })
  })
}

module.exports = {
  existsFile,
  encodeIcon
}
