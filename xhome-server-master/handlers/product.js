const prdIntr = require("../interactions/product");
const accIntr = require("../interactions/account");
const {
    validateIdParam,
	validatePagingParams,
    validateOptionalKeywordParam,
	validateProduct,
	validateFilterProductParams
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

async function createProduct(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addProduct");
        const prdRes = await validateProduct(req.body);
        // Split catalog id from object
        const { id, ...restInfo } = prdRes;
		let promise = prdIntr.create(id, restInfo);
		const newProduct = await safePerformDBFunction(promise);
		promise = prdIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: newProduct, count });
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllProducts(req, res) {
	try {
		const data = await prdIntr.getAll();
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getProducts(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewProduct");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		const promise = prdIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getProductsByCatalogId(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewProduct");
        const { id, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const idRes = await validateIdParam({ id });
		const promise = prdIntr.getPagingByCatalogId(
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

async function getAllProductsByCatalogId(req, res) {
	try {
        let validateRes = await validateIdParam(req.query);
		const data = await prdIntr.getByCatalogId(validateRes.id);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchProducts(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewProduct");
		const { 
			keyword, 
			page, quantity, 
			materialId, fractionId, agencyId, catalogId,
			materialName, fractionName, agencyName, catalogName
		} = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const keywordRes = await validateOptionalKeywordParam({ keyword });
		const filterRes = await validateFilterProductParams({ 
			materialId, fractionId, agencyId, catalogId,
			materialName, fractionName, agencyName, catalogName
		});
		const promise = prdIntr.searchPagingByKeyword(
			keywordRes.keyword,
			pagingRes.quantity, 
			pagingRes.page,
			filterRes
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function searchAllProducts(req, res) {
	try {
		let validateRes = await validateKeywordParam(req.query);
		const data = await prdIntr.searchAllByKeyword(validateRes.keyword);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function updateProduct(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editProduct");
        const prdRes = await validateProduct(req.body);
		const promise = prdIntr.update(prdRes);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function deleteMiniProduct(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteProduct");
        let validateRes = await validateIdParam(req.query);
		const promise = prdIntr.removeMiniProduct(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function importData(req, res) {
	try {
		// let validateRes = await validateKeywordParam(req.body);
		const data = await prdIntr.importData(req.body);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	importData,
	createProduct,
	getProducts,
	searchProducts,
	searchAllProducts,
	updateProduct,
	deleteMiniProduct,
    getAllProducts,
    getProductsByCatalogId,
    getAllProductsByCatalogId,
};
