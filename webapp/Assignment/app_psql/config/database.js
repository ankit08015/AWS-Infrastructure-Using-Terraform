const Sequelize = require('sequelize');
// var config = {
//    /*don't forget to add host, port, dialect, etc.*/
//   }
//var sequelize = new Sequelize(database, username, password, config);
module.exports = new Sequelize('api', 'me', 'Ajaygoel@123', {
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
      "createdAt": "createdat",
      "updatedAt": "updatedat"
    }
  });