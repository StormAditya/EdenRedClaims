const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME || 'mydb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    logging: console.log,
})


module.exports = sequelize