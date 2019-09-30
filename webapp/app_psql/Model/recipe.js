const Sequelize = require('sequelize');
const db = require('../config/database');

const recipe = db.define('recipes', {
  author_id: {
    type: Sequelize.UUIDV4
  },
  cook_time_in_min: {
    type: Sequelize.INTEGER,
    validate :{
      isMul5: function(value) {
        if(parseInt(value) % 5 != 0) {
          throw new Error('Only muliple of 5 values are allowed in cook_time_in_min!')
        }
      }
    }
  },
  title: {
    type: Sequelize.STRING
  },
  prep_time_in_min: {
    type: Sequelize.INTEGER,
    validate :{
      isMul5: function(value) {
        if(parseInt(value) % 5 != 0) {
          throw new Error('Only muliple of 5 values are allowed in prep_time_in_min!')
        }
      }
    }
  },
  total_time_in_min :{
    type: Sequelize.INTEGER
  },
  cusine:{
    type: Sequelize.STRING
  },
  servings :{
    type: Sequelize.INTEGER
  },  
  ingredients :{
    type : Sequelize.ARRAY(Sequelize.STRING),
    unique : true
  }
})

module.exports = recipe;