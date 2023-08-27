const { DataTypes } = require("sequelize");

const modelName = "products";
const modelAttributes = {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	note: {
		type: DataTypes.TEXT,
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