
'use strict'

module.exports = (sequelize, DataTypes) => {

const imageInfo = sequelize.define('images', {
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
    },
    S3Key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    metadata :{
        type : DataTypes.JSON(DataTypes.STRING)
    }
})

return imageInfo;
};