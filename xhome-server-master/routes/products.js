var express = require("express");
var router = express.Router();
var productHandler = require("../handlers/product");
var authHandler = require("../handlers/auth");

router
	.route("/")
	.get(authHandler.verify, productHandler.getProducts)
    .post(authHandler.verify, productHandler.createProduct)
    .put(authHandler.verify, productHandler.updateProduct)
    .delete(authHandler.verify, productHandler.deleteMiniProduct);

router
    .route("/all")
    .get(productHandler.getAllProducts);

router
    .route("/search")
    .get(authHandler.verify, productHandler.searchProducts);

router
    .route("/search-all")
    .get(productHandler.searchAllProducts);

router
    .route("/by-catalog-id")
    .get(authHandler.verify, productHandler.getProductsByCatalogId);

router
    .route("/all-by-catalog-id")
    .get(productHandler.getAllProductsByCatalogId);

router
    .route("/import")
    .post(productHandler.importData);

module.exports = router;
