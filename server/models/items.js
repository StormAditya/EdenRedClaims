const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Items = sequelize.define("Items", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,

    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Item name is required"
            },
            notNull: {
                msg: "Item name is required"
            }
        }
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            notNull: {
                msg: "Quantity is required"
            },
            isInt: {
                msg: "Quantity must be a whole number"
            },
            min: 1
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Price is required"
            },
            isFloat: {
                msg: "Price must be a correct decimal number"
            }
        }
    },
    receipt_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Receipt ID is required"
            },
            notNull: {
                msg: "Receipt ID is required"
            }
        }
    }
}, {
    tableName: "Items",
    timestamps: true,
    underscored: true

});
module.exports = Items;
