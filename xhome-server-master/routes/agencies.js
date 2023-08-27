var express = require("express");
var router = express.Router();
var agencyHandler = require("../handlers/agency");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, agencyHandler.getAgencies)
    .post(authHandler.verify, agencyHandler.createAgency)
    .put(authHandler.verify, agencyHandler.updateAgency)
    .delete(authHandler.verify, agencyHandler.deleteAgency);

router
    .route("/all")
    .get(agencyHandler.getAllAgencies);

router
    .route("/name-all")
    .get(authHandler.verify, agencyHandler.getAgencySupplier);

router
    .route("/search")
    .get(authHandler.verify, agencyHandler.searchAgencies);

router
    .route("/search-all")
    .get(agencyHandler.searchAllAgencies);

router
    .route("/search-name")
    .get(authHandler.verify, agencyHandler.searchAgenciesName);

router
    .route("/by-fraction-id")
    .get(authHandler.verify, agencyHandler.getAgenciesByFractionId);

router
    .route("/all-by-fraction-id")
    .get(agencyHandler.getAllAgenciesByFractionId);

module.exports = router;
