const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('User', {
    id: {
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
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'email is required'
            },
            notNull: {
                msg: 'email is required'
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Company Name is required'
            },
            notNull: {
                msg: 'Name is reqd'
            }
        }
    },
    contact_number: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    user_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true
        }
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true, //update and set balance are remaining
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
        validate: {
            isAlpha: true
        }
    }

}, {
    tableName: 'User',
    timestamps: true,
    underscored: true
})

module.exports = User