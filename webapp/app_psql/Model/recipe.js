const Sequelize = require('sequelize');
const db = require('../config/database');

const recipe = db.define('recipes', {
  title: {
    type: Sequelize.STRING
  },
  cook_time_in_min: {
    type: Sequelize.INTEGER,
    validate :{
      isMul5: function(value) {
        if(parseInt(value) % 5 != 0) {
          throw new Error('Only muliple of 5 values are allowed!')
        }
      }
    }
  },
  // prep_time_in_min: {

  // }
  author_id: {
    type: Sequelize.UUIDV4
  }
})

module.exports = recipe;