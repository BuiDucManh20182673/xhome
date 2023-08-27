const bcrypt = require('bcrypt');
const { safePerformDBFunction } = require('../common/util');
const { 
    validateAuthParams,
    validateNewAccount, 
    validatePagingParams,
    validatePermissions,
    validateKeywordParam,
    validateIdParam,
    validateUpdateAccount
} = require("../common/validate");
const accIntr = require("../interactions/account");
const authHandler = require("./auth");
const saltRounds = parseInt(process.env.SALT_ROUNDS || 10);

async function createAccount(req, res) {
    try {
        // Check params
        const validateRes = await validateNewAccount(req.body);
        // Hash password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(
            validateRes.password, 
            salt
        );
        // Save to database
        let promise = accIntr.create({
            ...validateRes,
            password: hashPassword
        });
        const newAcc = await safePerformDBFunction(promise);
        // Hide password by get this account again
        promise = accIntr.findById(newAcc.id);
        const plainAccount = await safePerformDBFunction(promise);
        // Count total records
        promise = accIntr.countTotalRows();
		const count = await safePerformDBFunction(promise);
        // Response to user new account
		res.json({ newRecord: plainAccount, count });
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function login(req, res) {
    try {
        // Check params
        let validateRes = await validateAuthParams(req.body);
        // Find account on database
        let promise = accIntr.findByUsername(validateRes);
        const account = await safePerformDBFunction(promise);
        const isValidPass = bcrypt.compareSync(
            validateRes.password, 
            account.password
        ); 
        if(account && isValidPass) {
            promise = accIntr.getPermissionById(account.id);
            const permission = await safePerformDBFunction(promise);
            res.json({ 
                token: authHandler.getToken(account),
                ...permission,
                isAdmin: account.isAdmin
            })
        } else {
            res.status(400).json({ err: "Wrong password or non-existed user" })
        }
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function getPagingAccounts(req, res) {
    try {
		let validateRes = await validatePagingParams(req.query);
        const { page, quantity } = validateRes;
        const promise = accIntr.getPagingAccounts(quantity, page);
        const accounts = await safePerformDBFunction(promise);
        res.json(accounts);
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function searchAccounts(req, res) {
    try {
        const { keyword, page, quantity } = req.query;
        const pagingRes = await validatePagingParams({ page, quantity });
		const keywordRes = await validateKeywordParam({ keyword });
        let promise = accIntr.searchPaging(
            keywordRes.keyword,
            pagingRes.page,
            pagingRes.quantity
        );
        const data = await safePerformDBFunction(promise);
        res.json(data);
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function updateAccount(req, res) {
    try {
        const validateRes = await validateUpdateAccount(req.body);
        // let promise = await accIntr.findById();
        let promise = accIntr.update(validateRes);
		const data = await safePerformDBFunction(promise);
		res.json(data);
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function updatePermission(req, res) {
    try {
		let validateRes = await validatePermissions(req.body);
        const promise = accIntr.updatePermission(
            validateRes.allowPermissions,
            validateRes.id
        );
        const result = await safePerformDBFunction(promise);
        res.json(result);
    } catch (err) {
        res
            .status(404)
            .json({ err });
    }
}

async function removeAccount(req, res) {
    try {
        let validateRes = await validateIdParam(req.query);
		const promise = accIntr.remove(validateRes.id);
		const data = await safePerformDBFunction(promise);
		res.json({ success: data });
    } catch (err) {
        console.log(err);
        res
            .status(404)
            .json({ err });
    }
}

module.exports = {
    login,
    createAccount,
    getPagingAccounts,
    updatePermission,
    searchAccounts,
    removeAccount,
    updateAccount
}