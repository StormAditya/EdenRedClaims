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
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Email-ID is required'
            },
            notNull: {
                msg: 'Email-ID is required'
            },
            isEmail: true
        }
    }, 
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address is required'
            },
            notNull: {
                msg: 'Address is required'
            }
        }
    },
    contact_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address is required'
            },
            notNull: {
                msg: 'Address is required'
            },
            len: [10],
            isNumeric: true,
        }
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
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Balance cannot be empty'
            },
            notNull: {
                msg: 'Balance cannot be null'
            },
            isNumeric: true,
        }
    }
}, {
    tableName: 'user',
    timestamps: true,
    underscored: true
})

module.exports = User