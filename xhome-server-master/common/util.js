module.exports.safePerformDBFunction = async (promise) => {
	let result;
	try {
		result = await promise;
	} catch (e) {
		console.log(e)
		throw "Database rejected !!!";
	}
	return result;
};