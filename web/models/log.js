const { LEVEL } = require(global.CONSTANTPATH)

const getLogLevel = (raw) => {
  const formattedValue = raw?.toUpperCase() ?? LEVEL.INFO
  return Object.keys(LEVEL).includes(formattedValue) ? LEVEL[formattedValue] : formattedValue
}

const formatLogLevel = (instance, options) => {
  instance.level = getLogLevel(instance.level)
}

const formatLogsLevel = (instances, options) => {
  for (const instance of instances) {
    instance.level = getLogLevel(instance.level)
  }
}

module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'log',
    {
      lid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      processId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      level: {
        type: DataTypes.STRING,
        allowNull: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      timestamps: true,
      deletedAt: false,
      hooks: {
        beforeCreate: formatLogLevel,
        beforeUpdate: formatLogLevel,
        beforeBulkCreate: formatLogsLevel
      }
    }
  )
  return Log
}
