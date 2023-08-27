var express = require("express");
var router = express.Router();
var authRoute = require("./auth");
var projectRoute = require("./projects");
var accountRoute = require("./accounts");
var materialRoute = require("./materials");
var fractionRoute = require("./fractions");
var agencyRoute = require("./agencies");
var catalogRoute = require("./catalogs");
var productRoute = require("./products");

router.use("/auth", authRoute);
router.use("/account", accountRoute);
router.use("/material", materialRoute);
router.use("/fraction", fractionRoute);
router.use("/agency", agencyRoute);
router.use("/catalog", catalogRoute);
router.use("/product", productRoute);
router.use("/project", projectRoute);

module.exports = router;
