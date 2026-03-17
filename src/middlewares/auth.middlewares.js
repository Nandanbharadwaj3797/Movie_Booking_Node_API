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

    if (!req.body || typeof req.body !== "object") {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Request body is missing"
        });
    }

    //  Prevent Extra / Malicious Fields (Mass Assignment Protection)
    const allowedFields = ["name", "email", "password"];
    const receivedFields = Object.keys(req.body);

    const isValidOperation = receivedFields.every(field =>
        allowedFields.includes(field)
    );

    if (!isValidOperation) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid fields in request"
        });
    }

    const { name, email, password } = req.body;
    const errors = [];

    //  Name validation
    if (!name || name.trim().length === 0) {
        errors.push("Name is required");
    }

    //  Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("Valid email is required");
    }

    //  Password validation
    if (!password) {
        errors.push("Password is required");
    } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    if (errors.length > 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            errors
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

    if (!req.body || typeof req.body !== "object") {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Request body is missing"
        });
    }

    //  Prevent extra fields
    const allowedFields = ["email", "password"];
    const receivedFields = Object.keys(req.body);

    const isValidOperation = receivedFields.every(field =>
        allowedFields.includes(field)
    );

    if (!isValidOperation) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid fields in request"
        });
    }

    const { email, password } = req.body;
    const errors = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim().length === 0) {
        errors.push("Email is required");
    } else if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }

    // Password validation
    if (!password || password.length === 0) {
        errors.push("Password is required");
    }

    if (errors.length > 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            errors
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

        const authHeader = req.headers["authorization"];
        let token;

        if (req.headers["x-access-token"]) {
            token = req.headers["x-access-token"];
        } else if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(STATUS.UNAUTHORIZED).json({
                ...errorResponseBody,
                err: "Authentication token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.AUTH_KEY);

        // Optional: skip DB hit if JWT contains all needed info
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            return res.status(STATUS.UNAUTHORIZED).json({
                ...errorResponseBody,
                err: "Invalid authentication token"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(STATUS.UNAUTHORIZED).json({
                ...errorResponseBody,
                err: "Invalid or expired token"
            });
        }

        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            ...errorResponseBody,
            err: "Authentication failed"
        });
    }
};


const validateResetPasswordRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== "object") {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Request body is missing"
        });
    }

    // Prevent extra fields (Mass assignment protection)
    const allowedFields = ["oldPassword", "newPassword"];
    const receivedFields = Object.keys(req.body);

    const isValidOperation = receivedFields.every(field =>
        allowedFields.includes(field)
    );

    if (!isValidOperation) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid fields in request"
        });
    }

    const { oldPassword, newPassword } = req.body;
    const errors = [];

    // Old password validation
    if (!oldPassword || oldPassword.trim().length === 0) {
        errors.push("Old password is required");
    }

    // New password validation
    if (!newPassword || newPassword.trim().length === 0) {
        errors.push("New password is required");
    } else if (newPassword.length < 6) {
        errors.push("New password must be at least 6 characters long");
    }

    // Prevent same password reuse
    if (oldPassword && newPassword && oldPassword === newPassword) {
        errors.push("New password cannot be same as old password");
    }

    if (errors.length > 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            errors
        });
    }

    next();
};

const forbid = (res, message = "Access denied") => {
    return res.status(STATUS.FORBIDDEN).json({
        ...errorResponseBody,
        err: message
    });
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.userRole)) {
            return forbid(res, "Access denied");
        }

        next();
    };
};

const isAdmin = authorizeRoles(USER_ROLE.ADMIN);
const isAdminOrClient = authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.CLIENT);



module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    isAuthenticated,
    validateResetPasswordRequest,
    isAdmin,
    isAdminOrClient,
    authorizeRoles
}