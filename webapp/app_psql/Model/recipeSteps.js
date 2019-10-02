'use strict'

module.exports = (sequelize, DataTypes) => {

    const recipeSteps = sequelize.define('steps', {
        recipeSteps_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        recipe_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        steps: {
            //type: DataTypes.JSON(DataTypes.STRING),
            type : DataTypes.ARRAY(DataTypes.JSON),
            allowNull: false,
            validate: {
                MinSteps: function (array_data) {
                    if (array_data.length < 1) {
                        throw new Error('Minimum 1 step is required in steps of preparing!')
                    }
                }
            }
        }
    },
    {
        underscored: true
    })
    return recipeSteps;
};