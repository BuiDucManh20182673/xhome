const { DataTypes } = require("sequelize");

const modelName = "requests";
const modelAttributes = {
    content: DataTypes.STRING
}
const modelOptions = { 
    tableName: modelName,
	createdAt: "created_at",
	updatedAt: "updated_at"
};

module.exports = {
    name: modelName, 
    attributes: modelAttributes,
    options: modelOptions
}