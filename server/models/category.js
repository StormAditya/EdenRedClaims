const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {

  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  category_name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
    validate: {
        notEmpty:{
            msg:'Category Name is required'
        },
        notNull: {
            msg: 'Name is reqd'
        }
    }
  }
}, {
  tableName: 'Category'
});

module.exports = Category;