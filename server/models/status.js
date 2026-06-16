const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define('Status', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  status_name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
    validate: {
        notEmpty:{
            msg:'Status Name is required'
        },
        notNull: {
            msg: 'Status Name is reqd'
        }
    }
  }
}, {
  tableName: 'Status'
});

module.exports = Status;