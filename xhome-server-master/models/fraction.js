const { DataTypes } = require("sequelize");

const modelName = "fractions";
const modelAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
};
const modelOptions = { 
	tableName: modelName,
	createdAt: "created_at",
	updatedAt: "updated_at"
};

module.exports = {
    name: modelName, 
    attributes: modelAttributes,
    options: modelOptions
};