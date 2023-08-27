var express = require("express");
var router = express.Router();
var fractionHandler = require("../handlers/fraction");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, fractionHandler.getFractions)
    .post(authHandler.verify, fractionHandler.createFraction)
    .put(authHandler.verify, fractionHandler.updateFraction)
    .delete(authHandler.verify, fractionHandler.deleteFraction);

router
    .route("/all")
    .get(authHandler.verify, fractionHandler.getAllFractions);

router
    .route("/name-all")
    .get(authHandler.verify, fractionHandler.getFractionName);

router
    .route("/search")
    .get(authHandler.verify, fractionHandler.searchFractions);

router
    .route("/search-name")
    .get(authHandler.verify, fractionHandler.searchFractionName);

router
    .route("/search-all")
    .get(fractionHandler.searchAllFractions);

router
    .route("/by-material-id")
    .get(authHandler.verify, fractionHandler.getFractionsByMaterialId);

router
    .route("/all-by-material-id")
    .get(authHandler.verify, fractionHandler.getAllFractionsByMaterialId);

module.exports = router;
