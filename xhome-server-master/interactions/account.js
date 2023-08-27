const { Op } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

async function create(data) {
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		const newAccount = await rootMySQL
			.getAccountModel().create(data, options);
		await rootMySQL.getPermissionModel().create({
			account_id: newAccount.id
		}, options);
		return newAccount;
	});
}

function countTotalRows() {
	return rootMySQL.getAccountModel().count();
}

async function grantAllPermission(id) {
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		const currPms = await rootMySQL.getPermissionModel().findOne({
			where: { account_id: id },
			...options
		});
		currPms.viewMaterial = true;
		currPms.addMaterial = true;
		currPms.editMaterial = true;
		currPms.deleteMaterial = true;
		currPms.viewFraction = true;
		currPms.addFraction = true;
		currPms.editFraction = true;
		currPms.deleteFraction = true;
		currPms.viewAgency = true;
		currPms.addAgency = true;
		currPms.editAgency = true;
		currPms.deleteAgency = true;
		currPms.viewCatalog = true;
		currPms.addCatalog = true;
		currPms.editCatalog = true;
		currPms.deleteCatalog = true;
		currPms.viewProduct = true;
		currPms.addProduct = true;
		currPms.editProduct = true;
		currPms.deleteProduct = true;
		currPms.viewProject = true;
		currPms.addProject = true;
		currPms.editProject = true;
		currPms.deleteProject = true;

		const newPermission = await rootMySQL.getPermissionModel()
			.upsert(currPms, {...options, returning: false});
		return newPermission;
	});
}

async function updatePermission(permissions, id) {
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		let currPms = await rootMySQL.getPermissionModel().findOne({
			where: { account_id: id },
			...options
		});
		if(!currPms) throw "Non existed account id"
		// Turn off all permission
		currPms.viewMaterial = false;
		currPms.addMaterial = false;
		currPms.editMaterial = false;
		currPms.deleteMaterial = false;
		currPms.viewFraction = false;
		currPms.addFraction = false;
		currPms.editFraction = false;
		currPms.deleteFraction = false;
		currPms.viewAgency = false;
		currPms.addAgency = false;
		currPms.editAgency = false;
		currPms.deleteAgency = false;
		currPms.viewCatalog = false;
		currPms.addCatalog = false;
		currPms.editCatalog = false;
		currPms.deleteCatalog = false;
		currPms.viewProduct = false;
		currPms.addProduct = false;
		currPms.editProduct = false;
		currPms.deleteProduct = false;
		currPms.viewProject = false;
		currPms.addProject = false;
		currPms.editProject = false;
		currPms.deleteProject = false;
		// Track each permission and turn on
		for (let i = 0; i < permissions.length; i++) {
			const element = permissions[i];
			if(element.startsWith("edit") || element.startsWith("delete")) {
				const regex = /^(edit|delete)/;
				currPms[element.replace(regex, "view")] = true;
			}
			currPms[element] = true;
		}
		// Update new permission to database
		const newPermission = await rootMySQL.getPermissionModel()
			.upsert(currPms, {...options, returning: false});
		// Response to user
		return newPermission;
	});
}

async function checkPermission(sessionUserInfo, permissionName) {
	// return;
	// Don't need to check permisison of admin
	if(sessionUserInfo.isAdmin) return;

	if(!sessionUserInfo || !sessionUserInfo.id) {
		throw "Session is not created.";
	}
	const permission = await getPermissionById(sessionUserInfo.id);
	if(!permission[permissionName]) {
		throw "Permission denied !!!";
	}
}

function getPermissionById(id) {
	return rootMySQL
		.getPermissionModel()
		.findOne({ 
			where: { account_id: id },
			raw: true 
		})
}

function findByUsername(data) {
	return rootMySQL.getAccountModel().findOne({
		where: {
			username: data.username,
			// password: data.password
		},
		// attributes: { exclude: ['password'] },
		raw : true
	});
}

function findById(id) {
    return rootMySQL.getAccountModel().findByPk(
		id,
		{ 
			attributes: { exclude: ['password'] }, 
			include: rootMySQL.getPermissionModel(),
			raw: true 
		}
	);
}

async function getPagingAccounts(accPerPage, page) {
	return rootMySQL.getAccountModel().findAndCountAll({
		offset: --page * accPerPage,
		limit: accPerPage,
		attributes: { exclude: ['password'] }, 
		include: [
			rootMySQL.getRequestModel(),
			rootMySQL.getPermissionModel()
		]
	});
}

async function update(data) {
	const { id, username, fullName } = data;
	return rootMySQL.getAccountModel().update(
		{ username, fullName }, 
		{ where: { id } }
	);
}

async function searchPaging(keyword, page, accPerPage) {
	return rootMySQL.getAccountModel().findAndCountAll({
		where: {
			[Op.or]: [
				{ username: { [Op.substring]: keyword } },
				{ fullName: { [Op.substring]: keyword } }
			]
		},
		offset: --page * accPerPage,
		limit: accPerPage,
		attributes: { exclude: ['password'] }, 
		include: [
			// rootMySQL.getRequestModel(),
			rootMySQL.getPermissionModel()
		]
	});
}

async function remove(id) {
	return rootMySQL
		.getAccountModel()
		.destroy({
			where: { id, isAdmin: { [Op.not]: true } }
		});
}

module.exports = {
	create,
	findById,
	checkPermission,
	getPagingAccounts,
	findByUsername,
	grantAllPermission,
	updatePermission,
	countTotalRows,
	getPermissionById,
	searchPaging,
	remove,
	update
};