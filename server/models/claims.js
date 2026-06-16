const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Claims = sequelize.define('Claims', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    claim_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Claim amount is required'
            },
            notNull: {
                msg: 'Claim amount is required'
            },
            isFloat: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isAlpha: true
        }
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: true
        }
    }, 
    validation_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    category_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Category is required'
            },
            notNull: {
                msg: 'Category is required'
            }
        }
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'UserID is required'
            },
            notNull: {
                msg: 'UserID is required'
            }
        }
    },
    status_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'status is required'
            },
            notNull: {
                msg: 'status is required'
            }
        }
    },
    

}, {
    tableName: 'Claims',
    timestamps: true,
    underscored: true
})

module.exports = Claims