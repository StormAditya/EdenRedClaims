const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('EdenClaim', 'postgres', 'AdityaDesai@12', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false, 
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

module.exports = sequelize;