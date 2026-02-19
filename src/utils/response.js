const successResponse = (res, statusCode, data, message) => {
    return res.status(statusCode).json({
        success: true,
        err: {},
        data,
        message
    });
};

const ErrorResponse = (res, statusCode, error, message) => {
    return res.status(statusCode).json({
        success: false,
        data: {},
        err: error,
        message
    });
};

module.exports = {
    successResponse,
    ErrorResponse
};
