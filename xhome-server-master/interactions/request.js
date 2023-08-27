const { Op } = require("sequelize");
const rootMySQL = require("../setup/rootMySQL");

function createFake(accId) {
    const fakeRequest = {
		content: "fake request 111",
		account_id: accId,
	};
	return rootMySQL.getRequestModel().create(fakeRequest);
}

module.exports = {
    createFake
}