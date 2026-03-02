const { errorResponseBody } = require("../utils/responsebody");

const validateUpdateUserRequest = (req, res, next) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Request body is required"
        });
    }

    const allowedFields = ["userRole", "userStatus"];
    const keys = Object.keys(req.body);

    // Reject if any invalid field present
    const invalidFields = keys.filter(
        key => !allowedFields.includes(key)
    );

    if (invalidFields.length > 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: `Invalid fields: ${invalidFields.join(", ")}`
        });
    }

    //  Enum validation
    const { userRole, userStatus } = req.body;

    if (
        userRole &&
        !Object.values(USER_ROLE).includes(userRole)
    ) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid user role"
        });
    }

    if (
        userStatus &&
        !Object.values(USER_STATUS).includes(userStatus)
    ) {
        return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: "Invalid user status"
        });
    }

    next();
};

module.exports = {
    validateUpdateUserRequest
};
