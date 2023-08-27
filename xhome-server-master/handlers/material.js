const matIntr = require("../interactions/material");
const accIntr = require("../interactions/account");
const {
    validateIdParam,
	validateNameParam,
	validatePagingParams,
	validateExistedMaterial,
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

async function createMaterial(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addMaterial");
		let validateRes = await validateNameParam(req.body);
		let promise = matIntr.create(validateRes);
		const data = await safePerformDBFunction(promise);
		promise = matIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: data, count });
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllMaterials(req, res) {
	try {
		const data = await matIntr.getAll();
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getMaterials(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewMaterial");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		let promise = matIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchMaterials(req, res) {
	try {
		const { name, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const nameRes = await validateNameParam({ name });
		const promise = matIntr.searchPagingByName(
			nameRes.name,
			pagingRes.quantity, 
			pagingRes.page
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchMaterialName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewMaterial");
		const { name, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const nameRes = await validateNameParam({ name });
		const promise = matIntr.searchDistinctPagingByName(
			nameRes.name,
			pagingRes.quantity, 
			pagingRes.page,
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err)
		res.status(404).json({ err });
	}
}

async function searchAllMaterials(req, res) {
	try {
		let validateRes = await validateNameParam(req.query);
		const data = await matIntr.searchAllByName(validateRes.name);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function updateMaterial(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editMaterial");
		let validateRes = await validateExistedMaterial(req.body);
		const promise = matIntr.update(validateRes);
        const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function deleteMaterial(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteMaterial");
		let validateRes = await validateIdParam(req.query);
		const promise = matIntr.destroy(validateRes.id);
        const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	createMaterial,
	getMaterials,
	searchMaterials,
	searchAllMaterials,
	updateMaterial,
	deleteMaterial,
	getAllMaterials,
	searchMaterialName,
};
