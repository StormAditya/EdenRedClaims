const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
    {
        dialect: 'postgres',
        database: process.env.DB_NAME || 'mydb',
        user: process.env.DB_USER || 'postgre',
        password: process.env.DB_PASSWORD || 'password',
        host: 'localhost',
        port: 5432,
        ssl: true,
        clientMinMessages: 'notice',
        logging: console.log
    }
)


module.exports = sequelize