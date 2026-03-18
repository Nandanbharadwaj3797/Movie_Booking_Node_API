const { ErrorResponse }= require('../utils/response');
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
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "Request body is missing"
        );
    }

    const { name, pincode, city } = req.body;

    if (!name || typeof name !== 'string') {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "The name of the theatre is not present or invalid"
        );
    }

    if (!pincode) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "The pincode of the theatre is not present"
        );
    }

    if (!city || typeof city !== 'string') {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "The city of the theatre is not present or invalid"
        );
    }

    next();
};

const validateUpdateMoviesRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "Request body is missing"
        );
    }

    const { insert, movieIds } = req.body;

    if (typeof insert !== 'boolean') {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "Insert field is missing or not of boolean type"
        );
    }

    if (!Array.isArray(movieIds)) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "movieIds field is missing or not of array type"
        );
    }

    if (movieIds.length === 0) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            null,
            "movieIds array cannot be empty"
        );
    }

    next();
};

module.exports = {
    validateTheatreCreateRequest,
    validateUpdateMoviesRequest
}