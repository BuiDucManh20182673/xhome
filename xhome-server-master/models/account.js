const { DataTypes } = require("sequelize");

const modelName = "accounts";
const modelAttributes = {
	fullName: {
		type: DataTypes.STRING,
		allowNull: false,
		field: "full_name",
		validate: {
			min: 1,
		},
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			min: 1,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			min: 1,
		},
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		field: "is_admin",
		default: false
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