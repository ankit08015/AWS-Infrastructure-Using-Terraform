'use strict'
const Sequelize = require('sequelize');
//const recipe = require('../Model/recipe');
const sequelize = new Sequelize('csye6225', 'dbuser', 'AjayGoel123', {
  host: 'csye6225-fall2019.c69v5rzxndyz.us-east-1.rds.amazonaws.com',
  dialect: 'postgres',
  operatorsAliases: false,
  dialectOptions: {
    ssl: true
 },
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
db.image = require('../Model/image')(sequelize,Sequelize);


//Relations
db.nutInfo.belongsTo(db.recipe);
db.recipe.hasOne(db.nutInfo);
db.recipe.belongsTo(db.user);
db.user.hasMany(db.recipe);
db.recipeSteps.belongsTo(db.recipe);
db.recipe.hasOne(db.recipeSteps);
db.recipe.hasOne(db.image);
db.image.belongsTo(db.recipe);

module.exports = db;

//module.exports = sequelize;