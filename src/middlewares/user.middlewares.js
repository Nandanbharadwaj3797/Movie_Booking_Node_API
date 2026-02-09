const { errorResponseBody } = require("../utils/responsebody");

const validateUpdateUserRequest = (req, res, next) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            ...errorResponseBody,
            err: 'Request body is required'
        });
    }

    const allowedFields = ['userRole', 'userStatus'];
    const keys = Object.keys(req.body);

    const hasAllowedField = keys.some(key => allowedFields.includes(key));
    if (!hasAllowedField) {
        return res.status(400).json({
            ...errorResponseBody,
            err: 'Malformed request, please send at least one valid parameter'
        });
    }

    const invalidFields = keys.filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
        return res.status(400).json({
            ...errorResponseBody,
            err: `Invalid fields: ${invalidFields.join(', ')}`
        });
    }

    next();
};

module.exports = {
    validateUpdateUserRequest
};
