const { DataTypes } = require("sequelize");

const modelName = "projects";
const modelAttributes = {
    contractId: {
        type: DataTypes.STRING,
        allowNull: false,
		field: "contract_id",
    },
	customerName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "customer_name"
    },
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