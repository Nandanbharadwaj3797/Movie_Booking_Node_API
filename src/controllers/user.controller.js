const userService = require("../services/user.service");
const { asyncHandler, sendSuccess } = require("../utils/handlers");
const { STATUS } = require("../utils/constants");

/**
 * Remove sensitive fields
 */
const sanitizeUser = (user) => {
    if (!user) return user;
    const plainUser = user.toObject ? user.toObject() : { ...user };
    delete plainUser.password;
    delete plainUser.__v;
    return plainUser;
};

const update = asyncHandler(async (req, res) => {
    const updatedUser = await userService.updateUserRoleOrStatus(
        req.body,
        req.params.id
    );

    if (!updatedUser) {
        return next({
            err: "User not found",
            code: STATUS.NOT_FOUND
        });
    }

    sendSuccess(res, STATUS.OK, sanitizeUser(updatedUser), "Successfully updated the user");
});

module.exports = {
    update
};