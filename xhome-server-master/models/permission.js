const { DataTypes } = require("sequelize");

const modelName = "permissions";
const modelAttributes = {
    viewMaterial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_material",
    },
    addMaterial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_material",
    },
    editMaterial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_material",
    },
    deleteMaterial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_material",
    },
    viewFraction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_fraction",
    },
    addFraction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_fraction",
    },
    editFraction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_fraction",
    },
    deleteFraction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_fraction",
    },
    viewAgency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_agency",
    },
    addAgency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_agency",
    },
    editAgency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_agency",
    },
    deleteAgency: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_agency",
    },
    viewCatalog: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_catalog",
    },
    addCatalog: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_catalog",
    },
    editCatalog: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_catalog",
    },
    deleteCatalog: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_catalog",
    },
    viewProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_product",
    },
    addProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_product",
    },
    editProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_product",
    },
    deleteProduct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_product",
    },
    viewProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "view_project",
    },
    addProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "add_project",
    },
    editProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "edit_project",
    },
    deleteProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "delete_project",
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