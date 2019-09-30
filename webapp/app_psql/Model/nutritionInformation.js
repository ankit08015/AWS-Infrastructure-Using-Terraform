const Sequelize = require('sequelize');
const db = require('../config/database');

const recipe = db.define('nutritionInformation', {
  calories: {
    type: Sequelize.INTEGER
  },
  cholesterol_in_mg: {
    type: Sequelize.FLOAT
  },
  sodium_in_mg: {
    type: Sequelize.INTEGER
  },
  carbohydrates_in_grams: {
    type: Sequelize.FLOAT
  },
  protein_in_grams: {
    type: Sequelize.FLOAT
  }
})

module.exports = nutritionInformation;