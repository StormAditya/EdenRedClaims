const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(
    {
        dialect: PostgresDialect,
        database: process.env.DB_NAME || 'mydb',
        user: process.env.DB_USER || 'postgre',
        password: process.env.DB_PASSWORD || 'password',
        host: 'localhost',
        port: 5432,
        ssl: true,
        clientMinMessages: 'notice',
    }
)


try {
  await sequelize.authenticate();
  console.log('Database connection successfully established.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


module.exports = sequelize