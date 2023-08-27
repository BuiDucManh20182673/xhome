var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var cors = require("cors");
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');

// Load environment variables
require('dotenv').config();

// Import root modules
const swaggerDocument = YAML.load('./setup/swagger.yaml');
const mysql = require("./setup/rootMySQL");

// Import routers
var apiRouter = require("./routes/index");

// Start database
mysql.setup();

var app = express();

app.use(logger("dev")); // should only log in development mode
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Host swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API router
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({ err: err.message });
});

module.exports = app;
