const successResponse = (res, statusCode, data, message) => {
    return res.status(statusCode).json({
        success: true,
        err: {},
        data,
        message
    });
};

module.exports = {
    successResponse
};
