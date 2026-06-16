const sequelize = require('../config/database');

const User = require('./User');
const Status = require('./Status');
const Category = require('./Category');
const Claim = require('./Claim');
const Receipt = require('./Receipt');
const Item = require('./Item');
const app = express()

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

sequelize.sync().then(() => {
    console.log('Database connected and synchronised...')
})

app.listen(5000, () => {
    console.log('running...')
})