const { STATUS } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {

    console.error("Error:", err);

    const statusCode = err.code || STATUS.INTERNAL_SERVER_ERROR;

    return res.status(statusCode).json({
        success: false,
        err: {},
        data: {},
        message: err.message || "Something went wrong"
    });
};

module.exports = errorHandler;
