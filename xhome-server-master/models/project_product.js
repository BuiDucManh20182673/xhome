const { DataTypes } = require("sequelize");

const modelName = "project_products";
const modelAttributes = {
    description: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.STRING,
    },
    note: {
        type: DataTypes.TEXT
    },
    material: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    catalog: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    miniProductCode: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "mini_product_code"
    },
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