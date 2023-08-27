const prjIntr = require("../interactions/project");
const accIntr = require("../interactions/account");
const { 
	validateProject, validateIdParam, validateUpdateProject, validatePagingParams 
} = require("../common/validate");
const { safePerformDBFunction } = require("../common/util");

// async function demoConvertImage(req, res) {
// const sharp = require("sharp");
// 	//   await sharp(__dirname + '/lugia.png')
// 	//     .rotate()
// 	//     .resize(200)
// 	//     .toBuffer()
// 	//     .then(data => res.send(data))
// 	//     .catch(err => res.send(err))
// 	await sharp(__dirname + "/pikachu.webp")
// 		.toFile(__dirname + "/output.png")
// 		.then((info) => {
// 			res.send(info);
// 		})
// 		.catch((err) => {
// 			res.send(err);
// 		});
// }

async function getProjects(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewProject");
		let validateRes = await validatePagingParams(req.query);
		const { page, quantity } = validateRes;
		let promise = prjIntr.getPaging(quantity, page);
		const data = await safePerformDBFunction(promise);
		promise = prjIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ projects: data, count })
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function createProject(req, res) {
	try {
		await accIntr.checkPermission(req.user, "addProject");
		const prjRes = await validateProject(req.body);
		let promise = prjIntr.create({
			// replace this when turn on 
			// created_account_id: req.user.id, authen
			created_account_id: 1,
			...prjRes,
		});
		const newProject = await safePerformDBFunction(promise);
		promise = prjIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
		res.json({ newRecord: newProject, count })
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function updateProject(req, res) {
	try {
		await accIntr.checkPermission(req.user, "editProject");
		const { id, ...project } = req.body;
		const idRes = await validateIdParam({ id });
		const prjRes = await validateUpdateProject(project);
		const promise = prjIntr.update(idRes.id, prjRes);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function deleteProject(req, res) {
	try {
		await accIntr.checkPermission(req.user, "deleteProject");
		let validateRes = await validateIdParam(req.query);
		const promise = prjIntr.destroy(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function getProjectById(req, res) {
	try {
		await accIntr.checkPermission(req.user, "viewProject");
		let validateRes = await validateIdParam(req.query);
		const promise = prjIntr.getById(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

async function getAllProjects(req, res) {
	try {
		const data = await prjIntr.getAll();
		res.json(data);
	} catch (err) {
		console.log(err);
		res.status(404).json({ err });
	}
}

module.exports = {
	getProjects,
	createProject,
	updateProject,
	deleteProject,
	getAllProjects,
	getProjectById,
};
