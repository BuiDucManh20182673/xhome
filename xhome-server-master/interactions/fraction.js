const { Op, Sequelize } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

function create(data) {
	return rootMySQL.getFractionModel().create(data);
}

function countTotalRows() {
	return rootMySQL.getFractionModel().count();
}

function getAllName() {
    return rootMySQL.getFractionModel().findAll({
        attributes: [ 
            Sequelize.fn('DISTINCT', Sequelize.col('name'))
        ],
        raw: true
    });
}

function getAll() {
    return rootMySQL.getFractionModel().findAll();
}

function getPaging(frcPerPage, page) {
    return rootMySQL.getFractionModel().findAndCountAll({
		offset: --page * frcPerPage,
		limit: frcPerPage,
	});
}

function getById(id) {
    return rootMySQL.getFractionModel().findByPk(id, { raw: true });
}

function getByMaterialId(id) {
    return rootMySQL.getFractionModel().findAll({
        where: {
            material_id: id
        }
    });
}

function getPagingByMaterialId(id, frcPerPage, page) {
    return rootMySQL.getFractionModel().findAndCountAll({
        where: {
            material_id: id
        },
        offset: --page * frcPerPage,
		limit: frcPerPage,
    });
}

function update(data) {
    return rootMySQL.getFractionModel().upsert(data);
}

function destroy(id) {
    return rootMySQL.getFractionModel().build({
        id
    }).destroy();
}

function searchAllByName(name) {
	return rootMySQL
		.getFractionModel()
		.findAll({
			where: {
				name: {
					[Op.substring]: name
				}
			}
		})
}

function searchPagingByName(name, frcPerPage, page) {
	return rootMySQL
		.getFractionModel()
		.findAndCountAll({
			where: {
				name: {
					[Op.substring]: name
				}
			},
			offset: --page * frcPerPage,
			limit: frcPerPage,
		})
}

function searchDistinctPagingByName(name, frcPerPage, page) {
	let query = {
		name: {
			[Op.substring]: name,
		}
	};
	return rootMySQL.getFractionModel().findAndCountAll({
		attributes: [[ 
			Sequelize.fn('DISTINCT', Sequelize.col('name')), 
			'name'
		]],
		where: query,
		distinct: true,
		col: 'name',
		offset: --page * frcPerPage,
		limit: frcPerPage,
	});
}

module.exports = {
    getById,
    create,
    getAll,
    getPaging,
    update,
    destroy,
    searchAllByName,
    searchPagingByName,
    getByMaterialId,
    getPagingByMaterialId,
    getAllName,
    countTotalRows,
    searchDistinctPagingByName
};