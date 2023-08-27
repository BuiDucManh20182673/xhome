const { Op, QueryTypes } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

const selectQuery = "\
    SELECT \
        mr.name material, \
        frc.name fraction,\
        agc.supplier,\
        CONCAT(dtb.name, '\n', dtb.email, '\n', dtb.tel) distributor,\
        cat.name catalog_name,\
        cat.image_url catalog_image,\
        pr.name product,\
        pr.catalog_id,\
        gr.name `group`,\
        gr.product_id,\
        mp.group_id,\
        mp.id id,\
        mp.name code,\
        mp.image_url \
    ";

const viewQuery = "\
    FROM mini_products mp \
    INNER JOIN `groups` gr ON mp.group_id = gr.id\
    INNER JOIN products pr ON gr.product_id = pr.id\
    INNER JOIN catalogs cat ON pr.catalog_id = cat.id\
    INNER JOIN agencies agc ON cat.agency_id = agc.id\
    LEFT JOIN distributors dtb ON agc.id = dtb.agency_id\
    INNER JOIN fractions frc ON agc.fraction_id = frc.id\
    INNER JOIN materials mr ON frc.material_id = mr.id \
";

async function create(catId, productInfo) {
	const { name, note, type, code, imageUrl } = productInfo;
	const Product = rootMySQL.getProductModel();
	const Group = rootMySQL.getGroupModel();
	const MiniProduct = rootMySQL.getMiniProductModel();
	return rootMySQL.getDatabase().transaction(async (t) => {
		const options = { transaction: t, raw: true };
		// Find existed product or create if it's not existed
		let query = { catalog_id: catId, name };
        let productObj = { name, note, catalog_id: catId };
		let product = await Product.findOne({
			where: query,
			...options,
        });
        if(!product) {
            product = await Product.create(productObj, options);
        }
		// Find existed group or create if it's not existed
		let groupObj = { name: type, product_id: product.id };
		const group = await Group.findOrCreate({
			default: groupObj,
			where: groupObj,
			...options,
        });
		// Find existed code or create if it's not existed
		const miniPrdObj = { name: code, imageUrl, group_id: group[0].id };
		query = { group_id: group[0].id, name: code };
		let miniProduct = await MiniProduct.findOne({
			where: query,
			...options,
        });
        if(!miniProduct) {
            miniProduct = await MiniProduct.create(miniPrdObj, options);
        }
		// Assign product_id and response to user
		miniProduct.product_id = product.id;
		return miniProduct;
	});
}

function countTotalRows() {
	return rootMySQL.getMiniProductModel().count();
}

function update(product) {
    const Product = rootMySQL.getProductModel();
	const Group = rootMySQL.getGroupModel();
	const MiniProduct = rootMySQL.getMiniProductModel();
    return rootMySQL.getDatabase().transaction(async (t) => {
        const options = { transaction: t, raw: true };
        const miniProductId = product.id;
        // Find existed product to get catalog id
        const currPrd = await Product.findOne({
            include: {
                model: rootMySQL.getGroupModel(),
                include: {
                    model: rootMySQL.getMiniProductModel(),
                    where: { id: miniProductId }
                }
            },
            ...options
        });
        // Build query and get product
        let query = { 
            catalog_id: currPrd.catalog_id, 
            name: product.name
        };
        let productRes = await Product.findOne({
			where: query,
			...options,
        });
        if(!productRes) {
            productRes = await Product.create({
                ...query,
                note: product.note
            }, options);
        }
        // Overwrite query to get group
        query = {
            product_id: productRes.id,
            name: product.type
        };
        let groupRes = await Group.findOrCreate({
            default: query,
            where: query,
            ...options,
        });
        // Update mini product
        let miniProductRes = await MiniProduct.upsert({
            id: miniProductId,
            group_id: groupRes[0].id,
            name: product.code,
            imageUrl: product.imageUrl,
        }, options)
        // Get only result
		let result = miniProductRes[0];
		result.product_id = productRes.id;
		return result;
    });
}

function destroy(id) {
	return rootMySQL
		.getProductModel()
		.build({
			id,
		})
		.destroy();
}

function removeMiniProduct(id) {
    return rootMySQL
        .getMiniProductModel()
        .build({
            id,
        })
        .destroy();
}

function getAll() {
	return rootMySQL.getProductModel().findAll({
		include: {
			model: rootMySQL.getGroupModel(),
			include: {
				model: rootMySQL.getMiniProductModel(),
			},
		},
	});
}

function getById(id) {
	return rootMySQL.getProductModel().findByPk(id, {
		include: {
			model: rootMySQL.getGroupModel(),
			include: {
				model: rootMySQL.getMiniProductModel(),
			},
		},
		raw: true,
	});
}

async function getPaging(itemPerPage, page) {
    const offset = --page * itemPerPage;
    const rawQuery = selectQuery + viewQuery + "LIMIT ? OFFSET ?;";
    const rows = await rootMySQL.getDatabase().query(rawQuery, { 
        replacements: [itemPerPage, offset],
        type: QueryTypes.SELECT,
    });
    const countRawQuery = "\
        SELECT COUNT(*) cnt\
        FROM mini_products mp\
    ";
    let countRes = await rootMySQL.getDatabase().query(countRawQuery, {
        type: QueryTypes.SELECT,
        plain: true,
        raw: false
    });
    return { count: countRes.cnt, rows };
}

function findFullMiniProduct(id){
    return rootMySQL.getMiniProductModel().findByPk(id, {
        include: {
            model: rootMySQL.getGroupModel(),
            include: {
                model: rootMySQL.getProductModel(),
                include: {
                    model: rootMySQL.getCatalogModel(),
                    include: {
                        model: rootMySQL.getAgencyModel(),
                        include: {
                            model: rootMySQL.getFractionModel(),
                            include: {
                                model: rootMySQL.getMaterialModel()
                            }
                        } 
                    } 
                }
            }
        },
        raw: true
    })
}

function searchAllByKeyword(keyword) {
    const rawQuery = selectQuery + viewQuery + "WHERE mp.name LIKE ?";
    return rootMySQL.getDatabase().query(rawQuery, { 
        replacements: [`%${keyword}%`],
        type: QueryTypes.SELECT,
    });
}


function getByCatalogId(id) {
	return rootMySQL.getProductModel().findAll({
		where: {
			catalog_id: id,
		},
	});
}

async function getPagingByCatalogId(id, itemPerPage, page) {
	const offset = --page * itemPerPage;
    const rawQuery = selectQuery + viewQuery + "WHERE cat.id = ? LIMIT ? OFFSET ?;";
    const rows = await rootMySQL.getDatabase().query(rawQuery, { 
        replacements: [id, itemPerPage, offset],
        type: QueryTypes.SELECT,
    });
    const countRawQuery = "SELECT COUNT(*) cnt " + viewQuery + "WHERE cat.id = ?";
    let countRes = await rootMySQL.getDatabase().query(countRawQuery, {
        replacements: [id],
        type: QueryTypes.SELECT,
        plain: true,
        raw: false
    });
    return { count: countRes.cnt, rows };
}

async function searchPagingByKeyword(keyword, itemPerPage, page, filterParams) {
    // Build query
    // Join keyword params
    let rawQuery = selectQuery + viewQuery;
    let searchQuery = "";
    if(keyword) {
        searchQuery += "(\
            mp.name LIKE $keyword \
            OR agc.supplier LIKE $keyword \
            OR frc.name LIKE $keyword \
        )";
    }
    // To avoid SQL Injection, we have to make sure filter ids is number
    // Join filter params
    let filterQuery = "";
    const buildFilterQuery = (filterParamName, dbFieldName, isBindParam) => {
        let filterValue = filterParams[filterParamName];
        let bindParam = "$" + filterParamName + "Param";
        if(filterValue){
            filterQuery += `${filterQuery || searchQuery ? "AND " : ""}
            ${dbFieldName} = ${isBindParam ? bindParam : filterValue} `
        }
    }
    buildFilterQuery("materialId", "mr.id");
    buildFilterQuery("fractionId", "frc.id");
    buildFilterQuery("agencyId", "agc.id");
    buildFilterQuery("catalogId", "cat.id");
    buildFilterQuery("materialName", "mr.name", true);
    buildFilterQuery("fractionName", "frc.name", true);
    buildFilterQuery("agencyName", "agc.supplier", true);
    buildFilterQuery("catalogName", "cat.name", true);
    if(searchQuery || filterQuery) {
        rawQuery += "WHERE " + searchQuery + filterQuery;
    }
    // Join paging params
    rawQuery += "LIMIT $limit OFFSET $offset;";
    // Start query to database and get result
	const rows = await rootMySQL.getDatabase().query(rawQuery, {
        bind: { 
            keyword: `%${keyword}%`,
            limit: itemPerPage,
            offset: --page * itemPerPage,
            materialNameParam: filterParams.materialName,
            fractionNameParam: filterParams.fractionName,
            agencyNameParam: filterParams.agencyName,
            catalogNameParam: filterParams.catalogName,
        },
        type: QueryTypes.SELECT,
    });
    let countRawQuery = "SELECT COUNT(*) cnt " + viewQuery;
    if(searchQuery || filterQuery) {
        countRawQuery += "WHERE " + searchQuery + filterQuery;
    }
    let countRes = await rootMySQL.getDatabase().query(countRawQuery, {
        bind: { 
            keyword: `%${keyword}%`,
            materialNameParam: filterParams.materialName,
            fractionNameParam: filterParams.fractionName,
            agencyNameParam: filterParams.agencyName,
            catalogNameParam: filterParams.catalogName,
        },
        type: QueryTypes.SELECT,
        plain: true,
        raw: false
    });
    return { count: countRes.cnt, rows };
}

async function importData (data) {
    const Material = rootMySQL.getMaterialModel();
    const Fraction = rootMySQL.getFractionModel();
    const Agency = rootMySQL.getAgencyModel();
    const Distributor = rootMySQL.getDistributorModel();
    const Catalog = rootMySQL.getCatalogModel();
    const Product = rootMySQL.getProductModel();
    const Group = rootMySQL.getGroupModel();
    const MiniProduct = rootMySQL.getMiniProductModel();
    return rootMySQL.getDatabase().transaction(async (t) => {
        const options = { transaction: t, raw: true };
        for (let i = 0; i < data.name.length; i++) {
            const element = data.name[i];
            let newMaterial = await Material.create(
                { name: element.name }, 
                options
            );
            data.name[i].id = newMaterial.id;
        }
        for (let i = 0; i < data.fraction.length; i++) {
            const element = data.fraction[i];
            let newFraction = await Fraction.create(
                { 
                    name: element.fraction, 
                    material_id: data.name[element.parentIdx].id
                }, 
                options
            );
            data.fraction[i].id = newFraction.id;
        }
        for (let i = 0; i < data.supplier.length; i++) {
            const element = data.supplier[i];
            let newAgency = await Agency.create(
                { 
                    supplier: element.name, 
                    fraction_id: data.fraction[element.parentIdx].id
                }, 
                options
            );
            await Distributor.create(
                {
                    name: "Duc",
                    email: "duc@gmail.com",
                    tel: "09123456789",
                    agency_id: newAgency.id
                },
                options
            );
            data.supplier[i].id = newAgency.id;
        }
        for (let i = 0; i < data.catalog.length; i++) {
            const element = data.catalog[i];
            let newCatalog = await Catalog.create(
                {
                    name: element.name,
                    imageUrl: element.imageUrl,
                    agency_id: data.supplier[element.parentIdx].id
                },
                options
            );
            data.catalog[i].id = newCatalog.id;
        }
        for (let i = 0; i < data.product.length; i++) {
            const element = data.product[i];
            let newProduct = await Product.create(
                {
                    name: element.product,
                    catalog_id: data.catalog[element.parentIdx].id
                },
                options
            );
            data.product[i].id = newProduct.id;
        }
        for (let i = 0; i < data.group.length; i++) {
            const element = data.group[i];
            let newGroup = await Group.create(
                {
                    name: element.group,
                    product_id: data.product[element.parentIdx].id
                },
                options
            );
            data.group[i].id = newGroup.id;
        }
        for (let i = 0; i < data.miniProduct.length; i++) {
            const element = data.miniProduct[i];
            await MiniProduct.create(
                {
                    name: element.name,
                    imageUrl: element.imageUrl,
                    group_id: data.group[element.parentIdx].id
                },
                options
            );
        }
        return { success: true };
    });
}

module.exports = {
	getById,
	create,
	getAll,
	getPaging,
	update,
    destroy,
    importData,
	searchAllByKeyword,
	searchPagingByKeyword,
	getByCatalogId,
    getPagingByCatalogId,
    removeMiniProduct,
    findFullMiniProduct,
    countTotalRows
};
