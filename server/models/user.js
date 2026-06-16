const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            },
            notNull: {
                msg: 'Name is required'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password is required'
            },
            notNull: {
                msg: 'Password is required'
            }
        }
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    user_type: {
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Type is required'
            },
            notNull: {
                msg: 'Type is required'
            }
        }
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: truw,
    }
}, {
    tableName: 'User',
    timestamps: true,
    underscored: true
})

module.exports = User