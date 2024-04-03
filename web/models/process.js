module.exports = (sequelize, DataTypes) => {
  const Process = sequelize.define(
    'process',
    {
      pid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      handle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }
  )

  return Process
}
