const { DataTypes } = require("sequelize");

const modelName = "catalogs";
const modelAttributes = {
	// type: {
	// 	type: DataTypes.STRING,
	// 	allowNull: false,
    // },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        field: "image_url",
        // validate: {
        //     isUrl: true
        // }
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