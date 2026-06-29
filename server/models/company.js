const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
        notEmpty:{
            msg:'Company Name is required'
        },
        notNull: {
            msg: 'Name is reqd'
        }
    }
  }
}, {
  tableName: 'Company'
});

module.exports = Company;