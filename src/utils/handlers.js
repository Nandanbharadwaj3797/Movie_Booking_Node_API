const { STATUS } = require('./constants');
const { errorResponseBody } = require('./responsebody');

/**
 * Wrapper for async controller handlers to eliminate duplicate try/catch
 * @param {Function} handler - Async controller function
 * @returns {Function} - Middleware function
 */
const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Simplified success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} data - Response data
 * @param {string} message - Success message
 */
const sendSuccess = (res, statusCode = STATUS.OK, data = {}, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    err: {},
    data,
    message
  });
};

/**
 * Simplified error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any} error - Error details/object
 * @param {string} message - Error message
 */
const sendError = (res, statusCode = STATUS.INTERNAL_SERVER_ERROR, error = {}, message = 'Something went wrong') => {
  return res.status(statusCode).json({
    success: false,
    data: {},
    err: error,
    message
  });
};

/**
 * Validation error response
 * @param {object} res - Express response object
 * @param {object} errors - Object with field errors
 * @param {string} message - Error message
 */
const sendValidationError = (res, errors = {}, message = 'Validation failed') => {
  return sendError(res, STATUS.BAD_REQUEST, errors, message);
};

module.exports = {
  asyncHandler,
  sendSuccess,
  sendError,
  sendValidationError
};
