const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Receipt = sequelize.define('Receipt', {
    receipt_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    receipt_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Amount is required'
            },
            notNull: {
                msg: 'Amount is required'
            },
            isFloat: true
        }
    },
    merchant_name: {
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
    claim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Claim ID is required'
            },
            notNull: {
                msg: 'Claim ID is required'
            }
        }
    }
}, {
    tableName: 'receipt',
    timestamps: true,
    underscored: true
})

module.exports = Receipt