'use strict'
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

//const recipe = require('../Model/recipe');
const USER = process.env.USER;
//const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_DATA , process.env.DATABASE_PASSWORD , {
const sequelize = new Sequelize( process.env.DATABASE , process.env.USER_DATA , process.env.DATABASE_PASSWORD , {  
  host: process.env.HOST, 
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