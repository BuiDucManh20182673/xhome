var express = require("express");
var router = express.Router();
var accHandler = require("../handlers/account");

router
    .route("/")
    .post(accHandler.login);

module.exports = router;
