const { DataTypes } = require("sequelize");

const modelName = "areas";
const modelAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
};
const modelOptions = { 
	tableName: modelName,
	timestamps: false
};

module.exports = {
    name: modelName, 
    attributes: modelAttributes,
    options: modelOptions
};