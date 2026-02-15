const { errorResponseBody } = require('../utils/responsebody');
const { STATUS } = require('../utils/constants');

/**
 * 
 * @param req -> HTTP request object
 * @param {*} res -> HTTP response object
 * @param {*} next -> next middleware function
 * @returns -> whether the request is valid or not
 */
const validateTheatreCreateRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "Request body is missing"
        });
    }

    const { name, pincode, city } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "The name of the theatre is not present or invalid"
        });
    }

    if (!pincode) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "The pincode of the theatre is not present in the request"
        });
    }

    if (!city || typeof city !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "The city of the theatre is not present or invalid"
        });
    }

    next();
};

const validateUpdateMoviesRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "Request body is missing"
        });
    }

    const { insert, movieIds } = req.body;

    if (typeof insert !== 'boolean') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "The insert parameter must be a boolean"
        });
    }

    if (!Array.isArray(movieIds)) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "Expected array of movie IDs"
        });
    }

    if (movieIds.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...errorResponseBody,
            message: "No movies present in the array provided"
        });
    }

    next();
};

module.exports = {
    validateTheatreCreateRequest,
    validateUpdateMoviesRequest
}