const getEnv = require('../lib/util/env')

const APP_NAME = getEnv('APP_NAME', 'kdp-ux')

const maxLogSize = parseInt(getEnv('MAX_LOG_SIZE', '25165824') / 3) || 8388608
const numBackups = parseInt(getEnv('NUMBER_BACKUPS', '3'))
const compress = getEnv('LOG_COMPRESS', false)

const NIGHTLY_CRON_SET = getEnv('NIGHTLY_CRON_SET', '0 3 * * *')

const PROMETHEUS_SERVICE = getEnv('PROMETHEUS_SERVICE', 'http://kps-prometheus:9090')
const LOKI_SERVICE = getEnv('LOKI_SERVICE', 'http://loki:3100')

module.exports = {
  APP_NAME,
  PORT: getEnv('PORT', 3300),
  DEFAULT_LANGUAGE: 'zh',
  LOCAL_USER: {
    name: getEnv('LOCAL_USER_NAME', 'admin'),
    userName: getEnv('LOCAL_USER_NAME', 'admin'),
    email: getEnv('LOCAL_USER_EMAIL', ''),
    isAdmin: true,
    isRoot: true,
    groups: [
      {
        name: getEnv('LOCAL_GROUP_NAME', 'admin'),
        type: 'organization',
        enabled: true
      }
    ]
  },
  DB: {
    seederStorageTableName: 'seeder_data',
    migrationStorageTableName: 'migration_data',
    database: getEnv('MYSQL_DATABASE', 'kdp_ux_db'),
    username: getEnv('DBUSERNAME', 'root'),
    password: getEnv('DBPASSWORD', '123456'),
    host: getEnv('MYSQL_HOST', '127.0.0.1'),
    port: getEnv('MYSQL_PORT', '3306'),
    dialect: 'mysql'
  },
  MAX_AGE: 0, // max-age
  SERVICE_DOMAIN: {
    CATALOG_MANAGER_DOMAIN: getEnv('CATALOG_MANAGER_DOMAIN', ''),
    OAM_API_SERVER_DOMAIN: getEnv('OAM_API_SERVER_DOMAIN', '')
  },
  METRICS_SERVICE: {
    PROMETHEUS_SERVICE,
    LOKI_SERVICE
  },
  CRON_SETS: {
    NIGHTLY_CRON_SET
  },
  LOG: {
    appenders: {
      error: {
        // error log
        compress, // log compress
        maxLogSize, // log rotate
        numBackups,
        type: 'file', // logger type
        filename: 'logs/error/error.log' // logger path
      },
      response: {
        // response log
        compress,
        maxLogSize,
        numBackups,
        type: 'file',
        filename: 'logs/response/response.log'
      },
      log: {
        // behavior log
        compress,
        maxLogSize, // log rotate
        numBackups,
        type: 'file',
        filename: 'logs/log/log.log'
      }
    },
    categories: {
      default: {
        appenders: ['response'],
        level: 'all'
      },
      log: {
        appenders: ['log'],
        level: 'all'
      },
      error: {
        appenders: ['error'],
        level: 'error'
      }
    }
  }
}
