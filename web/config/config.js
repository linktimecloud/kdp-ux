const config = require('config')
const defaultDB = config.get('DB')
const getEnv = require('../lib/util/env')

const DB = {}
for (const k in defaultDB) {
  DB[k] = getEnv(`MYSQL_${k.toUpperCase()}`, defaultDB[k])
}

DB.seederStorage = 'sequelize'
DB.migrationStorage = 'sequelize'

module.exports = {
  development: DB,
  test: DB,
  production: DB
}
