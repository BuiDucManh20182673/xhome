const frcIntr = require("../interactions/fraction");
const accIntr = require("../interactions/account");
const {
	validateIdParam,
	validateNameParam,
	validatePagingParams,
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

async function createFraction(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addFraction");
		const { id, name } = req.body;
		let nameRes = await validateNameParam({ name });
		let idRes = await validateIdParam({ id });
		let promise = frcIntr.create({
			name: nameRes.name,
			material_id: idRes.id,
		});
		const data = await safePerformDBFunction(promise);
		promise = frcIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: data, count });
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllFractions(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		const data = await frcIntr.getAll();
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getFractions(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		const promise = frcIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getFractionName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		const promise = frcIntr.getAllName();
        const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getFractionsByMaterialId(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		const { id, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const idRes = await validateIdParam({ id });
		const promise = frcIntr.getPagingByMaterialId(
			idRes.id,
			pagingRes.quantity,
			pagingRes.page
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllFractionsByMaterialId(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		let validateRes = await validateIdParam(req.query);
		const data = await frcIntr.getByMaterialId(validateRes.id);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchFractions(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		const { name, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const nameRes = await validateNameParam({ name });
		const promise = frcIntr.searchPagingByName(
			nameRes.name,
			pagingRes.quantity,
			pagingRes.page
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchAllFractions(req, res) {
	try {
		let validateRes = await validateNameParam(req.query);
		const promise = frcIntr.searchAllByName(validateRes.name);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchFractionName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewFraction");
		const { name, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const nameRes = await validateNameParam({ name });
		const promise = frcIntr.searchDistinctPagingByName(
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

async function updateFraction(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editFraction");
		const { id, name } = req.body;
		let nameRes = await validateNameParam({ name });
		let idRes = await validateIdParam({ id });
		let promise = await frcIntr.getById(id);
		const existedFraction = await safePerformDBFunction(promise);
		promise = frcIntr.update({
			id: idRes.id,
			name: nameRes.name,
			material_id: existedFraction.material_id
		});
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function deleteFraction(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteFraction");
		let validateRes = await validateIdParam(req.query);
		const promise = frcIntr.destroy(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	createFraction,
	getFractions,
	searchFractions,
	searchAllFractions,
	updateFraction,
	deleteFraction,
	getAllFractions,
	getFractionsByMaterialId,
	getAllFractionsByMaterialId,
	getFractionName,
	searchFractionName,
};
