
'use strict'

module.exports = (sequelize, DataTypes) => {

const recipe = sequelize.define('recipes', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  cook_time_in_min: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate :{
      isMul5: function(value) {
        if(parseInt(value) % 5 != 0) {
          throw new Error('Only muliple of 5 values are allowed in cook_time_in_min!')
        }
      }
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prep_time_in_min: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate :{
      isMul5: function(value) {
        if(parseInt(value) % 5 != 0) {
          throw new Error('Only muliple of 5 values are allowed in prep_time_in_min!')
        }
      }
    }
  },
  total_time_in_min :{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cusine:{
    type: DataTypes.STRING,
    allowNull: false
  },
  servings :{
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min:1,
      max:5
    }
  },  
  ingredients :{
    type : DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      isUnique: function(array){
        if(new Set(array).size !== array.length){
          throw new Error('Only unique ingredients are allowed!')
        }
      }
    }
   // unique : true
  } ,
  steps :{
    type : DataTypes.JSON(DataTypes.STRING),
    allowNull: false,
    validate: {
      MinSteps : function(json_data){
        if(json_data.length<1){
          throw new Error('Minimum 1 step is required in steps of preparing!')
        }
      }
    }
    //unique : true
  }
},  
  {
    underscored: true
  });

return recipe;
};