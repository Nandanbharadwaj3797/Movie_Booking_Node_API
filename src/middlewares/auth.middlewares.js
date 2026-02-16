const jwt = require('jsonwebtoken');
const { errorResponseBody } = require('../utils/responsebody');
const userService = require('../services/user.service');
const { USER_ROLE,STATUS } = require('../utils/constants');


/**
 * validator for user signup
 * @param req -> http request object
 * @param res -> http response object
 * @param next -> next middleware
 */
const validateSignupRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.name) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "Name of the user not present in the request"
        });
    }

    if (!req.body.email) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "Email of the user not present in the request"
        });
    }

    if (!req.body.password) {
        return res.status(STATUS.BAD_REQUEST).json({
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
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.email) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "No email provided for sign in"
        });
    }

    if (!req.body.password) {
        return res.status(STATUS.BAD_REQUEST).json({
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
            return res.status(STATUS.UNAUTHORIZED).json({
                ...errorResponseBody,
                err: "Authentication token missing"
            });
        }


        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        const user = await userService.getUserById(decoded.id);

        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({
                ...errorResponseBody,
                err: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(STATUS.UNAUTHORIZED).json({
                ...errorResponseBody,
                err: error.message
            });
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            ...errorResponseBody,
            err: error.message
        });
    }
};



const validateResetPasswordRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: "Request body is missing"
        });
    }

    if (!req.body.oldPassword) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: 'Missing the old password in the request'
        });
    }

    if (!req.body.newPassword) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            err: 'Missing the new password in the request'
        });
    }

    next();
};

const forbid = (res, message) => {
    return res.status(STATUS.FORBIDDEN).json({
        ...errorResponseBody,
        err: message
    });
};

const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (!req.user || req.user.userRole !== USER_ROLE.admin) {
        return forbid(res, "User is not an admin, cannot proceed with the request");
    }
    next();
};

const isClient = (req, res, next) => {
    if (!req.user || req.user.userRole !== USER_ROLE.client) {
        return forbid(res, "User is not a client, cannot proceed with the request");
    }
    next();
};

const isAdminOrClient = (req, res, next) => {
    if (
        !req.user ||
        (req.user.userRole !== USER_ROLE.admin &&
         req.user.userRole !== USER_ROLE.client)
    ) {
        return forbid(
            res,
            "User is neither a client nor an admin, cannot proceed with the request"
        );
    }
    next();
};



module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest,
    isAdmin,
    isClient,
    isAdminOrClient
}