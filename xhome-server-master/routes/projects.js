var express = require("express");
var router = express.Router();
var projectHandler = require("../handlers/project");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, projectHandler.getProjects)
	.post(authHandler.verify, projectHandler.createProject)
    .put(authHandler.verify, projectHandler.updateProject)
	.delete(authHandler.verify, projectHandler.deleteProject);

router
    .route("/all")
    .get(projectHandler.getAllProjects);

router
	.route("/by-id")
	.get(authHandler.verify, projectHandler.getProjectById);

module.exports = router;
