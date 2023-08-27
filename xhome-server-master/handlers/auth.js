var jwt = require("jsonwebtoken");
var jwtValidator = require("express-jwt");

const privateKey = "Lord knight never die !!!";

function getToken(payload) {
	// payload must be the user public information
	// don't store any private information at here
	return jwt.sign(payload, privateKey);
}

const verify = jwtValidator({
	secret: privateKey,
	algorithms: ["HS256"],
});

// const verify = (req, res, next) => {
// 	next();
// }

function isAdmin(req, res, next) {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	res
		.status(403)
		.json({ err: "You must be admin to call this API" });
}

module.exports = {
    verify,
	isAdmin,
	getToken
};
