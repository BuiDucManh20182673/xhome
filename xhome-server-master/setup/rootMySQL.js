const { Sequelize } = require("sequelize");
const accountModel = require("../models/account");
const permissionModel = require("../models/permission");
const productModel = require("../models/products");
const miniProductModel = require("../models/mini_products");
const catalogModel = require("../models/catalog");
const groupModel = require("../models/group");
const agencyModel = require("../models/agency");
const distributorModel = require("../models/distributor");
const fractionModel = require("../models/fraction");
const materialModel = require("../models/material");
const projectModel = require("../models/project");
const areaModel = require("../models/area");
const projectProductModel = require("../models/project_product");
const requestModel = require("../models/request");

const dbInfo = {
	dialect: "mysql",
	database: "test",
	username: "root",
	password: "123456",
	logging: false,
	define: {
		charset: 'utf8',
  		collate: 'utf8_unicode_ci'
	}
};
let database;

async function connect() {
	database = new Sequelize(dbInfo);
	await database.authenticate();
	console.log("Connection has been established successfully.");
}

function getDatabase() {
	return database;
}

function createPureModels() {
	function shortDefineModel(model) {
		const { name, attributes, options } = model;
		database.define(name, attributes, options);
	}
	shortDefineModel(accountModel);
	shortDefineModel(permissionModel);
	shortDefineModel(productModel);
	shortDefineModel(miniProductModel);
	shortDefineModel(catalogModel);
	shortDefineModel(groupModel);
	shortDefineModel(agencyModel);
	shortDefineModel(distributorModel);
	shortDefineModel(fractionModel);
	shortDefineModel(materialModel);
	shortDefineModel(projectModel);
	shortDefineModel(areaModel);
	shortDefineModel(projectProductModel);
	shortDefineModel(requestModel);

	console.log("All models created.");
}

function getModel(name) {
	return database.model(name);
}
function getAccountModel() {
	return getModel(accountModel.name);
}
function getPermissionModel() {
	return getModel(permissionModel.name);
}
function getProductModel() {
	return getModel(productModel.name);
}
function getMiniProductModel() {
	return getModel(miniProductModel.name);
}
function getCatalogModel() {
	return getModel(catalogModel.name);
}
function getGroupModel() {
	return getModel(groupModel.name);
}
function getAgencyModel() {
	return getModel(agencyModel.name);
}
function getDistributorModel() {
	return getModel(distributorModel.name);
}
function getFractionModel() {
	return getModel(fractionModel.name);
}
function getMaterialModel() {
	return getModel(materialModel.name);
}
function getProjectModel() {
	return getModel(projectModel.name);
}
function getAreaModel() {
	return getModel(areaModel.name);
}
function getProjectProductModel() {
	return getModel(projectProductModel.name);
}
function getRequestModel() {
	return getModel(requestModel.name);
}

function createModelAssociations() {
	// Get models
	const Account = getAccountModel();
	const Permission = getPermissionModel();
	const Product = getProductModel();
	const MiniProduct = getMiniProductModel();
	const Catalog = getCatalogModel();
	const Group = getGroupModel();
	const Agency = getAgencyModel();
	const Distributor = getDistributorModel();
	const Fraction = getFractionModel();
	const Material = getMaterialModel();
	const Project = getProjectModel();
	const Area = getAreaModel();
	const ProjectProduct = getProjectProductModel();
	const Request = getRequestModel();

	// Define associations
	// - 1 Material can have multiple Fractions
	const matXfrcOpts = {
		foreignKey: {
			name: "material_id",
			allowNull: false,
		},
	};
	Material.hasMany(Fraction, matXfrcOpts);
	Fraction.belongsTo(Material, matXfrcOpts);
	// - 1 Fraction can have multiple Agencies
	const frcXagcOpts = {
		foreignKey: {
			name: "fraction_id",
			allowNull: false,
		},
	};
	Fraction.hasMany(Agency, frcXagcOpts);
	Agency.belongsTo(Fraction, frcXagcOpts);
	// - 1 Agency can have 1 Distributor
	const agcXdisOpts = {
		foreignKey: {
			name: "agency_id",
			allowNull: false,
		},
	};
	Agency.hasOne(Distributor, agcXdisOpts);
	Distributor.belongsTo(Agency, agcXdisOpts);
	// - 1 Agency can have multiple Catalogs
	const agcXcatOpts = {
		foreignKey: {
			name: "agency_id",
			allowNull: false,
		},
	};
	Agency.hasMany(Catalog, agcXcatOpts);
	Catalog.belongsTo(Agency, agcXcatOpts);
	// - 1 Catalog can have multiple Products
	const catXprdOpts = {
		foreignKey: {
			name: "catalog_id",
			allowNull: false,
		},
	};
	Catalog.hasMany(Product, catXprdOpts);
	Product.belongsTo(Catalog, catXprdOpts);
	// - 1 Product can have multiple Groups
	const prdXgrpOpts = {
		foreignKey: {
			name: "product_id",
			allowNull: false,
		},
	};
	Product.hasMany(Group, prdXgrpOpts);
	Group.belongsTo(Product, prdXgrpOpts);
	// - 1 Groups can have multiple MiniProducts
	const grpXmPrdOpts = {
		foreignKey: {
			name: "group_id",
			allowNull: false
		},
	};
	Group.hasMany(MiniProduct, grpXmPrdOpts);
	MiniProduct.belongsTo(Group, grpXmPrdOpts);
	// - 1 Account can have many Project
	const accXprjOpts = {
		foreignKey: {
			name: "created_account_id",
			allowNull: false,
		},
	};
	Account.hasMany(Project, accXprjOpts);
	Project.belongsTo(Account, accXprjOpts);
	// - 1 Project can have multiple Areas
	const prjXareOpts = {
		foreignKey: {
			name: "project_id",
			allowNull: false,
		},
	};
	Project.hasMany(Area, prjXareOpts);
	Area.belongsTo(Project, prjXareOpts);
	// - 1 Area can have multiple ProjectProducts
	const areXpjmOpts = {
		foreignKey: {
			name: "area_id",
			allowNull: false,
		},
	};
	Area.hasMany(ProjectProduct, areXpjmOpts);
	ProjectProduct.belongsTo(Area, areXpjmOpts);

	// - 1 Account can have multiple Requests
	const accXreqOpts = {
		foreignKey: {
			name: "account_id",
			allowNull: false,
		},
	};
	Account.hasMany(Request, accXreqOpts);
	Request.belongsTo(Account, accXreqOpts);
	// - 1 Account can have 1 permission
	const accXpmsOpts = {
		foreignKey: {
			name: "account_id",
			allowNull: false
		},
	};
	Account.hasOne(Permission, accXpmsOpts);
	Permission.belongsTo(Account, accXpmsOpts);

	console.log("All associations created.");
}

async function syncModels() {
	await database.sync({ force: true });
	console.log("All models were synchronized successfully.");
}

async function generateTestData() {
	let matItr = require("../interactions/material");
	let frcItr = require("../interactions/fraction");
	let agcItr = require("../interactions/agency");
	let catItr = require("../interactions/catalog");
	let accItr = require("../interactions/account");
	let prdItr = require("../interactions/product");
	let bcrypt = require("bcrypt");

	// Generate accounts
	await accItr.create({
		username: "xhome",
		password: bcrypt.hashSync(
			"xhome", 
			bcrypt.genSaltSync(8)
		),
		fullName: "Admin XHome",
		isAdmin: true
	});

	let fullUser = await accItr.create({
		username: "userfull",
		password: bcrypt.hashSync(
			"userfull", 
			bcrypt.genSaltSync(8)
		),
		fullName: "Super user"
	});
	await accItr.grantAllPermission(fullUser.id);

	await accItr.create({
		username: "user",
		password: bcrypt.hashSync(
			"user", 
			bcrypt.genSaltSync(8)
		),
		fullName: "Normal user",
		isAdmin: false
	});

	// Generate materials
	const cloth = await matItr.create({ name: "Vải" });
	const wood = await matItr.create({ name: "Gỗ" });
	await frcItr.create({
		material_id: cloth.id,
		name: "Thượng hạng"
	});
	const highClothFrc = await frcItr.create({
		material_id: cloth.id,
		name: "Cao cấp"
	});
	await frcItr.create({
		material_id: wood.id,
		name: "Cao cấp"
	});
	const normalWoodFrc = await frcItr.create({
		material_id: wood.id,
		name: "Trung cấp"
	});
	await frcItr.create({
		material_id: wood.id,
		name: "Hạ cấp"
	});

	// Generate agencies
	const clothAgc = await agcItr.create(highClothFrc.id, "Dormeuil", { 
		name: "Nguyễn Văn A", 
		email: "nva@gmail.com", 
		tel: "09123456789" 
	});
	const woodAgc = await agcItr.create(normalWoodFrc.id, "Dormeuil", { 
		name: "Nguyễn Văn A", 
		email: "nva@gmail.com", 
		tel: "09123456789" 
	});

	// Generate catalogs
	const clothCat = await catItr.create(clothAgc.agency.id, { 
		// type: "No Vent", 
		name: "Italian suit", 
		imageUrl: "https://fake-image.com.vn" 
	});
	await catItr.create(clothAgc.agency.id, { 
		// type: "Single Vent", 
		name: "American Suit", 
		imageUrl: "https://fake-image.com.vn" 
	});
	await catItr.create(clothAgc.agency.id, { 
		// type: "Double Vent", 
		name: "England Suit", 
		imageUrl: "https://fake-image.com.vn" 
	});
	const woodCat = await catItr.create(woodAgc.agency.id, { 
		// type: "Nội thất", 
		name: "Sofa", 
		imageUrl: "https://fake-image.com.vn" 
	});

	// Generate products
	await prdItr.create(clothCat.id, {
		name: "Brunello Cucinelli",
		type: "BC",
		code: "BC001",
		note: "Navy virgin wool V-neck suit jacket from Brunello\
			Cucinelli featuring notched lapels, a v-neck, a front\
			button fastening and a curved hemline.",
		imageUrl: "https://cdn-images.farfetch-contents.com/14/02/78/00/14027800_18231299_1000.jpg", 
	})
	await prdItr.create(clothCat.id, {
		name: "Salvatore Ferragamo",
		type: "SF",
		code: "SF001",
		note: "You know what they say - the suit picks the man,\
			not visa versa - and you best believe that this \
			two-piece suit from Salvatore Ferragamo wants you on\
			its side. Your new Sunday best boasts a stone grey hue\
			amid a single-breasted silhouette. Confidence 'suits' you.",
		imageUrl: "https://cdn-images.farfetch-contents.com/14/02/78/00/14027800_18231299_1000.jpg", 
	})
	await prdItr.create(clothCat.id, {
		name: "Dsquared2",
		type: "BC",
		code: "BC002",
		note: "Proving that the Caten twins aren't just fun and games,\
			this grey virgin wool two-piece suit from DSQUARED2\
			celebrates classic Italian tailoring at its finest.\
			Featuring a jacket with peaked lapels, a broad welt\
			chest pocket, a front button fastening, front flap \
			pockets, long sleeves, button cuffs and a double vent\
			to the rear. The slim tailored trousers feature a \
			waistband, a side button fastening, a concealed front\
			fastening, side slit pockets, two back buttoned welt\
			pockets, creases and a regular length.",
		imageUrl: "https://cdn-images.farfetch-contents.com/14/02/78/00/14027800_18231299_1000.jpg", 
	});
	await prdItr.create(woodCat.id, {
		name: "Bộ Sofa chất liệu da bò Ý Lorenzo",
		type: "SF",
		code: "SF-5253",
		note: "Thương hiệu: LORENZO\
			Dòng sản phẩm: SOFA MALAYSIA SF-5253\
			Mua nhiều giảm giá nhiều\
			Miễn phí giao hàng nội thành Hà Nội",
		imageUrl: "https://cdn-images.farfetch-contents.com/14/02/78/00/14027800_18231299_1000.jpg", 
	})
	await prdItr.create(woodCat.id, {
		name: "Bộ Sofa thông minh da bò ý Divano",
		type: "SF",
		code: "SF-0020",
		note: "Thương hiệu: BIZNOITHAT\
			Dòng sản phẩm: SOFA NHẬP KHẨU L-475\
			Mua nhiều giảm giá nhiều\
			Miễn phí giao hàng nội thành Hà Nội",
		imageUrl: "https://cdn-images.farfetch-contents.com/14/02/78/00/14027800_18231299_1000.jpg", 
	})

	console.log("Created test data. ");
}

async function setup() {
	try {
		await connect();
		createPureModels();
		createModelAssociations();
		// await syncModels();
		// await generateTestData();
	} catch (e) {
		// console.log(e);
		console.log(`Error in rootMySQL.js: ${e}`);
	}
}

module.exports = {
	setup,
	getDatabase,
	getAccountModel,
	getProductModel,
	getCatalogModel,
	getGroupModel,
	getMiniProductModel,
	getAgencyModel,
	getDistributorModel,
	getAgencyModel,
	getFractionModel,
	getMaterialModel,
	getProjectModel,
	getAreaModel,
	getProjectProductModel,
	getRequestModel,
	getPermissionModel
};
