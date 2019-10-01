'use strict'
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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.user = require('../Model/user')(sequelize, Sequelize);
db.recipe = require('../Model/recipe')(sequelize, Sequelize);
db.nutInfo = require('../Model/nutritionInformation')(sequelize, Sequelize);
db.recipeSteps = require('../Model/recipeSteps')(sequelize,Sequelize);

//Relations
db.nutInfo.belongsTo(db.recipe);
db.recipe.hasOne(db.nutInfo);
db.recipe.belongsTo(db.user);
db.user.hasMany(db.recipe);
db.recipeSteps.belongsTo(db.recipe);
db.recipe.hasMany(db.recipeSteps);

module.exports = db;

//module.exports = sequelize;