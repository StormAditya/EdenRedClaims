const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: true,
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
  }
}, {
  tableName: 'Company'
});

module.exports = Company;