var express = require("express");
var router = express.Router();
var authHandler = require("../handlers/auth");
var accHandler = require("../handlers/account");

router
    .route("/")
    .get(authHandler.verify, authHandler.isAdmin, accHandler.getPagingAccounts)
    .post(authHandler.verify, authHandler.isAdmin, accHandler.createAccount)
    .put(authHandler.verify, authHandler.isAdmin, accHandler.updateAccount)
    .delete(authHandler.verify, authHandler.isAdmin, accHandler.removeAccount);

router
    .route("/search")
    .get(authHandler.verify, authHandler.isAdmin, accHandler.searchAccounts);

router
    .route("/permission")
    .put(authHandler.verify, authHandler.isAdmin, accHandler.updatePermission);
    
module.exports = router;