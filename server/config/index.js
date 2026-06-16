
const sequelize = require('./database');

const User = require('../models/user');
const Status = require('../models/status');
const Category = require('../models/category');
const Claims = require('../models/claims');
const Receipt = require('../models/receipt');
const Item = require('../models/items');
const { FORCE } = require('sequelize/lib/index-hints');

User.hasMany(Claims, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Claims.belongsTo(User, { foreignKey: 'user_id' });
Status.hasMany(Claims, {foreignKey: 'status_id', onDelete: 'CASCADE' });
Claims.belongsTo(Status, {foreignKey: 'status_id'});
Category.hasMany(Claims, {foreignKey: 'category_id', onDelete: 'CASCADE'})
Claims.belongsTo(Category, {foreignKey: 'category_id'})

Receipt.hasOne(Claims, {foreignKey: 'claim_id', onDelete: 'CASCADE'})
Claims.belongsTo(Receipt, {foreignKey: 'claim_id'})

//ADD a foregin key in ITEMS:
//REFERENCING: RECEIPT_ID

sequelize.sync({alter: true}).then(() => {
    console.log('Database connected and synchronised...')
})

