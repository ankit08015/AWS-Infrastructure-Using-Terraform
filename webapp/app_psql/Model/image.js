
'use strict'

module.exports = (sequelize, DataTypes) => {

const imageInfo = sequelize.define('image', {
    image_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    recipe_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

return imageInfo;
};