const { Op, Sequelize } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

async function create(agencyId, catalogInfo) {
    return rootMySQL
        .getCatalogModel()
        .create({ agency_id: agencyId, ...catalogInfo });		
}

function countTotalRows() {
	return rootMySQL.getCatalogModel().count();
}

function getAll() {
	return rootMySQL.getCatalogModel().findAll();
}

function getAllName() {
    return rootMySQL.getCatalogModel().findAll({
        attributes: [ 
            Sequelize.fn('DISTINCT', Sequelize.col('name'))
        ],
        raw: true
    });
}

function getById(id) {
	return rootMySQL.getCatalogModel().findByPk(id, { raw: true });
}

function getPaging(catPerPage, page) {
	return rootMySQL.getCatalogModel().findAndCountAll({
		offset: --page * catPerPage,
		limit: catPerPage,
		include: {
			model: rootMySQL.getAgencyModel(),
			include: [
				{ model: rootMySQL.getDistributorModel() },
				{ 
					model: rootMySQL.getFractionModel(),
					include: rootMySQL.getMaterialModel() 
				}
			],
		},
	});
}

function getByAgencyId(id) {
	return rootMySQL.getCatalogModel().findAll({
		where: {
			agency_id: id,
		},
	});
}

function getPagingByAgencyId(id, catPerPage, page) {
	return rootMySQL.getCatalogModel().findAndCountAll({
		where: {
			agency_id: id,
		},
		offset: --page * catPerPage,
		limit: catPerPage,
		include: {
			model: rootMySQL.getAgencyModel(),
			include: [
				{ model: rootMySQL.getDistributorModel() },
				{ 
					model: rootMySQL.getFractionModel(),
					include: rootMySQL.getMaterialModel() 
				}
			],
		},
	});
}

function update(id, agencyId, catalogInfo) {
    return rootMySQL.getCatalogModel().upsert({
        id,
        ...catalogInfo,
        agency_id: agencyId
    });
}

function destroy(id) {
	return rootMySQL.getCatalogModel().build({
        id
    }).destroy();
}

function searchAllByKeyword(keyword) {
	return rootMySQL.getCatalogModel().findAll({
		where: {
			[Op.or]: [
                { name: { [Op.substring]: keyword } }
            ]
		},
	});
}

function searchPagingByKeyword(keyword, catPerPage, page) {
	return rootMySQL.getCatalogModel().findAndCountAll({
		where: {
			name: { [Op.substring]: keyword }
			// [Op.or]: [
            //     { type: { [Op.substring]: keyword } },
            //     { name: { [Op.substring]: keyword } }
            // ]
		},
		offset: --page * catPerPage,
		limit: catPerPage,
		include: {
			model: rootMySQL.getAgencyModel(),
			include: [
				{ model: rootMySQL.getDistributorModel() },
				{ 
					model: rootMySQL.getFractionModel(),
					include: rootMySQL.getMaterialModel() 
				}
			],
		},
	});
}

function searchDistinctPagingByName(name, catPerPage, page) {
	let query = {
		name: {
			[Op.substring]: name,
		}
	};
	return rootMySQL.getCatalogModel().findAndCountAll({
		attributes: [[ 
			Sequelize.fn('DISTINCT', Sequelize.col('name')), 
			'name'
		]],
		where: query,
		distinct: true,
		col: 'name',
		offset: --page * catPerPage,
		limit: catPerPage,
	});
}

module.exports = {
	getById,
	create,
	getAll,
	getPaging,
	update,
	destroy,
	searchAllByKeyword,
	searchPagingByKeyword,
    getByAgencyId,
	getPagingByAgencyId,
	getAllName,
	countTotalRows,
	searchDistinctPagingByName
};
