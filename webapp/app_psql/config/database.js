const Sequelize = require('sequelize');
//const recipe = require('../Model/recipe');
const sequelize = new Sequelize('api', 'me', 'Ajaygoel@123', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    "createdAt": "created_date",
    "updatedAt": "updated_date"
  }
});

module.exports = sequelize;