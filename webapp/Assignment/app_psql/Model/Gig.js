const Sequelize = require('sequelize');
const db = require('../config/database');

const Gig = db.define('gig', {
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  }
})

module.exports = Gig;