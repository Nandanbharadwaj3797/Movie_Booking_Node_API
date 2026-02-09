const jwt = require('jsonwebtoken');
const { errorResponseBody } = require('../utils/responsebody');
const userService = require('../services/user.service');

/**
 * validator for user signup
 * @param req -> http request object
 * @param res -> http response object
 * @param next -> next middleware
 */
const validateSignupRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.name) {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Name of the user not present in the request"
        });
    }

    if (!req.body.email) {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Email of the user not present in the request"
        });
    }

    if (!req.body.password) {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Password of the user not present in the request"
        });
    }

    next();
};


/**
 * validator for user signin
 * @param req -> http request object
 * @param res -> http response object
 * @param next -> next middleware
 */
const validateSigninRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.email) {
        return res.status(400).json({
            ...errorResponseBody,
            err: "No email provided for sign in"
        });
    }

    if (!req.body.password) {
        return res.status(400).json({
            ...errorResponseBody,
            err: "No password provided for sign in"
        });
    }

    next();
};

/**
 * middleware to check if the user is authenticated or not
 * it will verify the token and attach the user id in the request object
 * @param req -> http request object
 * @param res -> http response object
 *  @param next -> next middleware
 */

const isAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.headers["x-access-token"] ||
            req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                ...errorResponseBody,
                err: "Authentication token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        const user = await userService.getUserById(decoded.id);

        // attach full user (best practice)
        req.user = user;

        next();

    } catch (error) {

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                ...errorResponseBody,
                err: error.message
            });
        }

        if (error.code === 404) {
            return res.status(404).json({
                ...errorResponseBody,
                err: "User doesn't exist"
            });
        }

        return res.status(500).json({
            ...errorResponseBody,
            err: "Internal Server Error"
        });
    }
};



const validateResetPasswordRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.oldPassword) {
        return res.status(400).json({
            ...errorResponseBody,
            err: 'Missing the old password in the request'
        });
    }

    if (!req.body.newPassword) {
        return res.status(400).json({
            ...errorResponseBody,
            err: 'Missing the new password in the request'
        });
    }

    next();
};



module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest
}