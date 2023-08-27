const { Op, Sequelize } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

async function create(fractionId, supplier, distributor) {
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		const newAgency = await rootMySQL
			.getAgencyModel()
			.create({ fraction_id: fractionId, supplier }, options);
		const newDistributor = await rootMySQL.getDistributorModel().create(
			{
				...distributor,
				agency_id: newAgency.id,
			},
			options
        );
		return { agency: newAgency, distributor: newDistributor };
	});
}

function countTotalRows() {
	return rootMySQL.getAgencyModel().count();
}

function getAllSupplier() {
    return rootMySQL.getAgencyModel().findAll({
        attributes: [[ 
			Sequelize.fn('DISTINCT', Sequelize.col('supplier')), 
			'name'
        ]],
        raw: true
    });
}

function getAll() {
	return rootMySQL.getAgencyModel().findAll({
		include: [rootMySQL.getDistributorModel()]
	});
}

function getById(id) {
	return rootMySQL.getAgencyModel().findByPk(id, { raw: true });
}

function getPaging(agcPerPage, page) {
	return rootMySQL.getAgencyModel().findAndCountAll({
		offset: --page * agcPerPage,
		limit: agcPerPage,
		include: [rootMySQL.getDistributorModel()],
	});
}

function getByFractionId(id) {
	return rootMySQL.getAgencyModel().findAll({
		where: {
			fraction_id: id,
		},
		include: [rootMySQL.getDistributorModel()],
	});
}

function getPagingByFractionId(id, agcPerPage, page) {
	return rootMySQL.getAgencyModel().findAndCountAll({
		where: {
			fraction_id: id,
		},
		offset: --page * agcPerPage,
		limit: agcPerPage,
		include: [rootMySQL.getDistributorModel()],
	});
}

function update(id, supplier, distributor) {
	const Agency = rootMySQL.getAgencyModel();
	const Distributor = rootMySQL.getDistributorModel();
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		const currAgency = await Agency.findByPk(
			id, 
			{ include: Distributor }
		);
		if(!currAgency) return { err: "Not existed agency !!!" }
		distributor.id = currAgency.distributor.id;
		distributor.agency_id = currAgency.id;
		await Distributor.upsert(distributor, options);
		const updatedAgency = await Agency.upsert(
			{
				id,
				supplier,
				fraction_id: currAgency.fraction_id
			},
			options
        );
		return { agency: updatedAgency, distributor };
	});
}

function searchAllBySupplier(supplier) {
	return rootMySQL.getAgencyModel().findAll({
		where: {
			supplier: {
				[Op.substring]: supplier,
			},
		},
		include: [rootMySQL.getDistributorModel()],
	});
}

function searchPagingBySupplier(supplier, agcPerPage, page, fractionId) {
	let query = {
		supplier: {
			[Op.substring]: supplier,
		}
	};
	// Find with fraction id if client send this param
	if(fractionId) query.fraction_id = fractionId
	return rootMySQL.getAgencyModel().findAndCountAll({
		where: query,
		offset: --page * agcPerPage,
		limit: agcPerPage,
		include: [rootMySQL.getDistributorModel()],
	});
}

function searchNamePaging(supplier, agcPerPage, page) {
	let query = {
		supplier: {
			[Op.substring]: supplier,
		}
	};
	return rootMySQL.getAgencyModel().findAndCountAll({
		attributes: [[ 
			Sequelize.fn('DISTINCT', Sequelize.col('supplier')), 
			'name'
		]],
		where: query,
		distinct: true,
		col: 'supplier',
		offset: --page * agcPerPage,
		limit: agcPerPage,
	});
}

function destroy(id) {
	return rootMySQL
		.getAgencyModel()
		.destroy({
			where: { id }
		})
}

module.exports = {
	getById,
	create,
	getAll,
	getPaging,
	update,
	destroy,
	searchAllBySupplier,
	searchPagingBySupplier,
	getByFractionId,
	getPagingByFractionId,
	getAllSupplier,
	countTotalRows,
	searchNamePaging
};
