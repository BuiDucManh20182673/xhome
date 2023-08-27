const agcIntr = require("../interactions/agency");
const accIntr = require("../interactions/account");
const {
    validateIdParam,
	validatePagingParams,
    validateSupplierParam,
    validateProfileParam,
	validateOptionalId,
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

async function createAgency(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addAgency");
        const { supplier, distributor, id } = req.body;
        await validateIdParam({ id });
        await validateSupplierParam({ supplier });
        let distributorRes = await validateProfileParam(distributor);
		let promise = agcIntr.create(id, supplier, distributorRes);
		const newAgency = await safePerformDBFunction(promise);
		promise = agcIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: newAgency, count });
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAllAgencies(req, res) {
	try {
		const data = await agcIntr.getAll();
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function getAgencies(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewAgency");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		const promise = agcIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAgencySupplier(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewAgency");
		const promise = agcIntr.getAllSupplier();
        const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function getAgenciesByFractionId(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewAgency");
        const { id, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const idRes = await validateIdParam({ id });
		const promise = agcIntr.getPagingByFractionId(
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

async function getAllAgenciesByFractionId(req, res) {
	try {
        let validateRes = await validateIdParam(req.query);
		const data = await agcIntr.getByFractionId(validateRes.id);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchAgencies(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewAgency");
		const { supplier, page, quantity, fractionId } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const supplierRes = await validateSupplierParam({ supplier });
		const idRes = await validateOptionalId({ id: fractionId });
		const promise = agcIntr.searchPagingBySupplier(
			supplierRes.supplier,
			pagingRes.quantity, 
			pagingRes.page,
			idRes.id
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchAgenciesName(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewAgency");
		const { supplier, page, quantity } = req.query;
		const pagingRes = await validatePagingParams({ page, quantity });
		const supplierRes = await validateSupplierParam({ supplier });
		const promise = agcIntr.searchNamePaging(
			supplierRes.supplier,
			pagingRes.quantity, 
			pagingRes.page,
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function searchAllAgencies(req, res) {
	try {
		let validateRes = await validateSupplierParam(req.query);
		const data = await agcIntr.searchAllBySupplier(validateRes.supplier);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function updateAgency(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editAgency");
		const { id, supplier, distributor } = req.body;
		const idRes = await validateIdParam({ id });
		const supplierRes = await validateSupplierParam({ supplier });
		const distributorRes = await validateProfileParam(distributor);
		const promise = agcIntr.update(
			idRes.id, 
			supplierRes.supplier, 
			distributorRes
		);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function deleteAgency(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteAgency");
        let validateRes = await validateIdParam(req.query);
		const promise = agcIntr.destroy(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

module.exports = {
	createAgency,
	getAgencies,
	searchAgencies,
	searchAllAgencies,
	updateAgency,
	deleteAgency,
    getAllAgencies,
    getAgenciesByFractionId,
	getAllAgenciesByFractionId,
	getAgencySupplier,
	searchAgenciesName,
};
