var express = require("express");
var router = express.Router();
var materialHandler = require("../handlers/material");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, materialHandler.getMaterials)
    .post(authHandler.verify, materialHandler.createMaterial)
    .put(authHandler.verify, materialHandler.updateMaterial)
    .delete(authHandler.verify, materialHandler.deleteMaterial);

router
    .route("/all")
    .get(materialHandler.getAllMaterials);

router
    .route("/search")
    .get(authHandler.verify, materialHandler.searchMaterials);

router
    .route("/search-name")
    .get(authHandler.verify, materialHandler.searchMaterialName);

router
    .route("/search-all")
    .get(materialHandler.searchAllMaterials);

module.exports = router;
