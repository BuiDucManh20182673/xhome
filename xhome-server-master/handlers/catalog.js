const catIntr = require("../interactions/catalog");
const accIntr = require("../interactions/account");
const {
    validateIdParam,
	validatePagingParams,
    validateCatalog,
    validateKeywordParam,
	validateNameParam,
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

async function createCatalog(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addCatalog");
        const { id, ...catalogInfo } = req.body;
        const idRes = await validateIdParam({ id });
        const catRes = await validateCatalog(catalogInfo);
		let promise = catIntr.create(idRes.id, catRes);
		const newCatalog = await safePerformDBFunction(promise);
		promise = catIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: newCatalog, count });
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getCatalogName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewCatalog");
		const promise = catIntr.getAllName();
        const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllCatalogs(req, res) {
	try {
		const data = await catIntr.getAll();
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function getCatalogs(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewCatalog");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		const promise = catIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function getCatalogsByAgencyId(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewCatalog");
        const { id, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const idRes = await validateIdParam({ id });
		const promise = catIntr.getPagingByAgencyId(
            idRes.id, 
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

async function getAllCatalogsByAgencyId(req, res) {
	try {
        let validateRes = await validateIdParam(req.query);
		const data = await catIntr.getByAgencyId(validateRes.id);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchCatalogs(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewCatalog");
		const { keyword, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const keywordRes = await validateKeywordParam({ keyword });
		const promise = catIntr.searchPagingByKeyword(
			keywordRes.keyword,
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

async function searchAllCatalogs(req, res) {
	try {
		let validateRes = await validateKeywordParam(req.query);
		const data = await catIntr.searchAllByKeyword(validateRes.keyword);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchCatalogName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewCatalog");
		const { name, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const nameRes = await validateNameParam({ name });
		const promise = catIntr.searchDistinctPagingByName(
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

async function updateCatalog(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editCatalog");
		const { id, ...catalogInfo } = req.body;
		const idRes = await validateIdParam({ id });
        const catRes = await validateCatalog(catalogInfo);
		let promise = catIntr.getById(id);
		const currCatalog = await safePerformDBFunction(promise);
		promise = catIntr.update(
			idRes.id, 
            currCatalog.agency_id,
            catRes
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function deleteCatalog(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteCatalog");
        let validateRes = await validateIdParam(req.query);
		const promise = catIntr.destroy(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

module.exports = {
	createCatalog,
	getCatalogs,
	searchCatalogs,
	searchAllCatalogs,
	updateCatalog,
	deleteCatalog,
    getAllCatalogs,
    getCatalogsByAgencyId,
	getAllCatalogsByAgencyId,
	getCatalogName,
	searchCatalogName
};
