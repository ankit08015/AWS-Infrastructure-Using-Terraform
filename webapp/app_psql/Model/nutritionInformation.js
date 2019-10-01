
'use strict'

module.exports = (sequelize, DataTypes) => {

const nutInfo = sequelize.define('nutrition', {
    nutr_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    recipe_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cholesterol_in_mg: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    sodium_in_mg: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carbohydrates_in_grams: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    protein_in_grams: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
})

return nutInfo;
};