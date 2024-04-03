const fs = require('fs')
const { capitalize, isFunction } = require('lodash')
const Sequelize = require('sequelize')
const config = require('config')
const mysql = require('mysql2/promise')
const dbConfig = config.get('DB')
const path = require('path')
const basename = path.basename(module.filename)
const getEnv = require(global.UTILPATH + '/env')

const db = {}
const sequelize = new Sequelize(
  getEnv('MYSQL_DATABASE', dbConfig.database),
  getEnv('MYSQL_USER', dbConfig.username),
  getEnv('MYSQL_PASSWORD', dbConfig.password),
  {
    dialect: dbConfig.dialect,
    host: getEnv('MYSQL_HOST', dbConfig.host),
    port: getEnv('MYSQL_PORT', dbConfig.port),
    pool: {
      max: 100,
      min: 0,
      idle: 200000,
      // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
      acquire: 1000000
    },
    logging: false,
    benchmark: true
  }
)

fs.readdirSync(__dirname, 'utf8')
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[capitalize(model.name)] = model
  })

Object.keys(db).forEach((modelName) => {
  const associate = db[modelName].associate
  const scopes = db[modelName].scopes
  if (associate) {
    db[modelName].associate(db)
  }
  if (scopes) {
    for (const name in scopes) {
      let scope = scopes[name]
      scope = isFunction(scope) ? scope(db) : scope
      db[modelName].addScope(name, scope)
    }
  }
})

const initDB = async () => {
  try {
    const dbname = getEnv('MYSQL_DATABASE', dbConfig.database)
    await mysql.createConnection({
      host: getEnv('MYSQL_HOST', dbConfig.host),
      port: getEnv('MYSQL_PORT', dbConfig.port),
      user: getEnv('MYSQL_USER', dbConfig.username),
      password: getEnv('MYSQL_PASSWORD', dbConfig.password)
    }).then((connection) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${dbname};`)
    })

    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync()
    console.log('Sequelize sync successfully.')
  } catch (e) {
    console.log('Database Initialization Error :', e)
    process.exit(1)
  }
}

initDB()

db.sequelize = sequelize
db.Sequelize = Sequelize
db.Op = Sequelize.Op

module.exports = db
