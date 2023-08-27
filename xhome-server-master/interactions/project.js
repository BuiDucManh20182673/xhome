const rootMySQL = require("../setup/rootMySQL");
const prdIntr = require("./product");

function getPaging(itemPerPage, page) {
	return rootMySQL.getProjectModel().findAll({
		offset: --page * itemPerPage,
        limit: itemPerPage,
        include: [
            {
                model: rootMySQL.getAreaModel(),
			    include: {
				    model: rootMySQL.getProjectProductModel(),
                },
            },
            {  
                model: rootMySQL.getAccountModel(),
                attributes: { exclude: ['password'] }, 
            }
        ]
	});
}

async function create(project) {
    const Project = rootMySQL.getProjectModel();
    const Area = rootMySQL.getAreaModel();
    const ProjectProduct = rootMySQL.getProjectProductModel();
    return rootMySQL.getDatabase().transaction(async (t) => {
        const options = { transaction: t, raw: true };
        for (let i = 0; i < project.areas.length; i++) {
            const area = project.areas[i];
            let validProducts = [];
            // Find and push valid product to each area of project
            // Append optional fields to product (like description, size, note)
            for (let j = 0; j < area.products.length; j++) {
                const product = area.products[j];
                const fullProduct = await prdIntr.findFullMiniProduct(
                    product.miniProductId
                );
                if(!fullProduct) continue;
                validProducts.push({
                    ...product,
                    miniProductCode: fullProduct.name,
                    catalog: fullProduct['group.product.catalog.name'],
                    material: fullProduct['group.product.catalog.agency.fraction.material.name']
                });
            }
            project.areas[i].products = validProducts;
        }
        // Create new project
        const projectParams = { 
            contractId: project.contractId, 
            customerName: project.customerName,
            created_account_id: project.created_account_id
        };
        const newProject = await Project.create(projectParams, options);
        for(let i = 0; i < project.areas.length; i++) {
            const areaParams = {
                project_id: newProject.id,
                name: project.areas[i].name
            };
            // Create new area
            const newArea = await Area.create(areaParams, options);
            for (let j = 0; j < project.areas[i].products.length; j++) {
                const product = project.areas[i].products[j];
                const productParams = {
                    ...product,
                    area_id: newArea.id
                };
                // Create new product of project
                const newProduct = await ProjectProduct.create(productParams, options);
                project.areas[i].products[j] = newProduct;
            }
            project.areas[i].id = newArea.id;
        }
        return { project };
    });
}

function countTotalRows() {
	return rootMySQL.getProjectModel().count();
}

function getById(id){
    return rootMySQL.getProjectModel().findByPk(id, {
        include: [
            { 
                model: rootMySQL.getAccountModel(),
                attributes: ['id', 'fullName', 'username']
            },
            { 
                model: rootMySQL.getAreaModel(),
                include: rootMySQL.getProjectProductModel()
            }
        ],
    });
}

function update(id, project) {
    const Project = rootMySQL.getProjectModel();
    const Area = rootMySQL.getAreaModel();
    const ProjectProduct = rootMySQL.getProjectProductModel();
    return rootMySQL.getDatabase().transaction(async (t) => {
        const options = { transaction: t, raw: true };
        // Find current project to get sensitive params
        const currProject = await getById(id);
        // Update current project
        const projectParams = {
            id,
            contractId: project.contractId, 
            customerName: project.customerName,
            created_account_id: currProject.created_account_id
        };
        await Project.upsert(projectParams, options);
        // Delete all area of current project
        await Area.destroy({
            where: { project_id: id }
        });
        // Find and push valid product to each area of project
        // Append optional fields to product (like description, size, note)
        for (let i = 0; i < project.areas.length; i++) {
            const area = project.areas[i];
            let validProducts = [];
            for (let j = 0; j < area.products.length; j++) {
                const product = area.products[j];
                const fullProduct = await prdIntr.findFullMiniProduct(
                    product.miniProductId
                );
                if(!fullProduct) continue;
                validProducts.push({
                    ...product,
                    miniProductCode: fullProduct.name,
                    catalog: fullProduct['group.product.catalog.name'],
                    material: fullProduct['group.product.catalog.agency.fraction.material.name']
                });
            }
            project.areas[i].products = validProducts;
        }
        // Loop each new areas
        for(let i = 0; i < project.areas.length; i++) {
            const areaParams = {
                project_id: id,
                name: project.areas[i].name
            };
            // Update new area
            const newArea = await Area.create(areaParams, options);
            for (let j = 0; j < project.areas[i].products.length; j++) {
                const product = project.areas[i].products[j];
                const productParams = {
                    ...product,
                    area_id: newArea.id
                };
                // Update new product of project
                const newProduct = await ProjectProduct.create(
                    productParams, 
                    options
                );
                project.areas[i].products[j] = newProduct;
            }
            project.areas[i].id = newArea.id;
        }
        return { project };
    });
}

function destroy(id) {
	return rootMySQL.getProjectModel().build({
        id
    }).destroy();
}

function getAll() {
	return rootMySQL.getProjectModel().findAll();
}

module.exports = {
	create,
	getAll,
	getPaging,
	update,
    destroy,
    getById,
    countTotalRows
};