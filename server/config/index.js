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

app.listen(5000, () => {
    console.log('running...')
})