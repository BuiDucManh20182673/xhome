const { Op, Sequelize } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

function create(data) {
	return rootMySQL.getMaterialModel().create(data);
}

function countTotalRows() {
	return rootMySQL.getMaterialModel().count();
}

function getAll() {
	return rootMySQL.getMaterialModel().findAll();
}

function getPaging(matPerPage, page) {
	return rootMySQL.getMaterialModel().findAndCountAll({
		offset: --page * matPerPage,
		limit: matPerPage,
		// include: [rootMySQL.getFractionModel()],
	});
}

function update(data) {
	return rootMySQL.getMaterialModel().upsert(data);
}

function destroy(id) {
	return rootMySQL
		.getMaterialModel()
		.build({
			id,
		})
		.destroy();
}

function searchAllByName(name) {
	return rootMySQL
		.getMaterialModel()
		.findAll({
			where: {
				name: {
					[Op.substring]: name
				}
			}
		})
}

function searchPagingByName(name, matPerPage, page) {
	return rootMySQL
		.getMaterialModel()
		.findAndCountAll({
			where: {
				name: {
					[Op.substring]: name
				}
			},
			offset: --page * matPerPage,
			limit: matPerPage,
		})
}

function searchDistinctPagingByName(name, matPerPage, page) {
	let query = {
		name: {
			[Op.substring]: name,
		}
	};
	return rootMySQL.getMaterialModel().findAndCountAll({
		attributes: [[ 
			Sequelize.fn('DISTINCT', Sequelize.col('name')), 
			'name'
		]],
		where: query,
		distinct: true,
		col: 'name',
		offset: --page * matPerPage,
		limit: matPerPage,
	});
}

module.exports = {
	create,
	getAll,
	getPaging,
	update,
	destroy,
	searchAllByName,
	searchPagingByName,
	countTotalRows,
	searchDistinctPagingByName
};
