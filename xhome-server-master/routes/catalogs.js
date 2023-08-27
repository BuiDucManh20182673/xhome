var express = require("express");
var router = express.Router();
var catalogHandler = require("../handlers/catalog");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, catalogHandler.getCatalogs)
    .post(authHandler.verify, catalogHandler.createCatalog)
    .put(authHandler.verify, catalogHandler.updateCatalog)
    .delete(authHandler.verify, catalogHandler.deleteCatalog);

router
    .route("/all")
    .get(catalogHandler.getAllCatalogs);

router
    .route("/name-all")
    .get(authHandler.verify, catalogHandler.getCatalogName);

router
    .route("/search")
    .get(authHandler.verify, catalogHandler.searchCatalogs);

router
    .route("/search-all")
    .get(catalogHandler.searchAllCatalogs);

router
    .route("/search-name")
    .get(authHandler.verify, catalogHandler.searchCatalogName);

router
    .route("/by-agency-id")
    .get(authHandler.verify, catalogHandler.getCatalogsByAgencyId);

router
    .route("/all-by-agency-id")
    .get(catalogHandler.getAllCatalogsByAgencyId);

module.exports = router;
