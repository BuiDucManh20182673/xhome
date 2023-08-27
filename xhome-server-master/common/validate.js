const Joi = require('joi');

const MAXIMUM_TITLE_CHARACTERS = 225;
const MAXIMUM_NOTE_CHARACTERS = 2000;
const MIN_EXISTED_NUMBER = 1;
const MAX_NUMBER = 99999;

const titleSchema = Joi.string().max(MAXIMUM_TITLE_CHARACTERS);
const noteSchema = Joi.string().max(MAXIMUM_NOTE_CHARACTERS);
const numberSchema = Joi.number().min(MIN_EXISTED_NUMBER).max(MAX_NUMBER);
const quantitySchema = numberSchema.integer();
const emailSchema = titleSchema.email();
const urlSchema = Joi.string().uri();

const pagingSchema = Joi.object({
    page: quantitySchema.required(),
    quantity: quantitySchema.required()
});

const authSchemaObj = {
    username: titleSchema.required(),
    password: titleSchema.required()
};

const updateAccountSchemaObj = {
    id: quantitySchema.required(),
    username: titleSchema.required(),
    fullName: titleSchema.required()
};

const newAccountSchemaObj = {
    ...authSchemaObj,
    fullName: titleSchema.required()
};

const idSchemaObj = {
    id: quantitySchema.required()
};

const optionalIdSchemaObj = {
    id: quantitySchema.allow(null, "")
}

const nameSchemaObj = {
    name: titleSchema.required()
};

const supplierSchemaObj = {
    supplier: titleSchema.required()
};

const keywordSchemaObj = {
    keyword: titleSchema.required()
};

const keywordOptionalSchemaObj = {
    keyword: titleSchema.allow(null, "")
};

const profileSchemaObj = {
    name: titleSchema.required(),
    email: emailSchema.required(),
    tel: titleSchema.required(),
}

const catalogSchemaObj = {
    name: titleSchema.required(),
    imageUrl: urlSchema.allow(null, "")
}

const productSchemaObj = {
    ...idSchemaObj,
    ...catalogSchemaObj,
    type: titleSchema.required(),
    code: titleSchema.required(),
    note: noteSchema.allow(null, "")
}

const areaProductSchemaObj = {
    miniProductId: quantitySchema.required(),
    description: titleSchema.allow(null, ""),
    size: titleSchema.allow(null, ""),
    note: noteSchema.allow(null, ""),
};

const areaSchemaObj = {
    name: titleSchema.required(),
    products: Joi.array().items(areaProductSchemaObj)
};

const projectSchemaObj = {
    contractId: titleSchema.required(),
    customerName: titleSchema.required(),
    areas: Joi.array().items(areaSchemaObj)
};

const filterProductSchemaObj = {
    materialId: quantitySchema.allow(null, ""),
    fractionId: quantitySchema.allow(null, ""),
    agencyId: quantitySchema.allow(null, ""),
    catalogId: quantitySchema.allow(null, ""),
    materialName: titleSchema.allow(null, ""),
    fractionName: titleSchema.allow(null, ""),
    agencyName: titleSchema.allow(null, ""),
    catalogName: titleSchema.allow(null, ""),
};

const allowPermissionSchemaObj = {
    id: quantitySchema.required(),
    allowPermissions: Joi.array().items(
        Joi.string().valid(
            "viewMaterial",
            "addMaterial",
            "editMaterial",
            "deleteMaterial",
            "viewFraction",
            "addFraction",
            "editFraction",
            "deleteFraction",
            "viewAgency",
            "addAgency",
            "editAgency",
            "deleteAgency",
            "viewCatalog",
            "addCatalog",
            "editCatalog",
            "deleteCatalog",
            "viewProduct",
            "addProduct",
            "editProduct",
            "deleteProduct",
            "viewProject",
            "addProject",
            "editProject",
            "deleteProject"
        )
    ).unique().required()
}

const validateOptions = {
    abortEarly: true
};

function validateNewAccount(data) {
    return Joi.object(newAccountSchemaObj).validateAsync(data); 
}

function validateAuthParams(data) {
    return Joi.object(authSchemaObj).validateAsync(data); 
}

function validatePagingParams(data) {
    return pagingSchema.validateAsync(data);
}

function validateNameParam (data) {
    return Joi.object(nameSchemaObj).validateAsync(data);
}

function validateIdParam (data) {
    return Joi.object(idSchemaObj).validateAsync(data);
}

function validateSupplierParam(data) {
    return Joi.object(supplierSchemaObj).validateAsync(data);
}

function validateCatalog(data) {
    return Joi.object(catalogSchemaObj).validateAsync(data);
}

function validateExistedMaterial (data) {
    let schemaObj = Object.assign({}, idSchemaObj, nameSchemaObj);
    return Joi.object(schemaObj).validateAsync(data);
}

function validateExistedAgency (data) {
    let schemaObj = Object.assign({}, idSchemaObj, supplierSchemaObj);
    return Joi.object(schemaObj).validateAsync(data);
}

function validateProfileParam(data) {
    return Joi.object(profileSchemaObj).validateAsync(data, validateOptions);
}

function validateKeywordParam(data) {
    return Joi.object(keywordSchemaObj).validateAsync(data);
}

function validateOptionalKeywordParam(data) {
    return Joi.object(keywordOptionalSchemaObj).validateAsync(data);
}

function validateProduct(data) {
    return Joi.object(productSchemaObj).validateAsync(data, validateOptions);
}

function validateProject(data) {
    return Joi.object(projectSchemaObj).validateAsync(data, validateOptions);
}

function validateUpdateProject(data) {
    return Joi.object(projectSchemaObj).validateAsync(
        data, 
        { ...validateOptions, allowUnknown: true }
    );
}

function validateFilterProductParams(data) {
    return Joi.object(filterProductSchemaObj).validateAsync(
        data,
        validateOptions
    );
}

function validateOptionalId(data) {
    return Joi.object(optionalIdSchemaObj).validateAsync(data);
}

function validateUpdateAccount(data) {
    return Joi.object(updateAccountSchemaObj).validateAsync(data);
}

function validatePermissions(data) {
    return Joi.object(allowPermissionSchemaObj).validateAsync(
        data,
        validateOptions
    ); 
}

module.exports = {
    validateUpdateAccount,
    validateIdParam,
    validateNameParam,
    validateKeywordParam,
    validateOptionalKeywordParam,
    validateAuthParams,
    validatePagingParams,
    validateExistedMaterial,
    validateSupplierParam,
    validateExistedAgency,
    validateCatalog,
    validateProfileParam,
    validateProduct,
    validateProject,
    validateUpdateProject,
    validateNewAccount,
    validateFilterProductParams,
    validateOptionalId,
    validatePermissions,
}