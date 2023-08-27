const { DataTypes } = require("sequelize");

const modelName = "distributors";
const modelAttributes = {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: false
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