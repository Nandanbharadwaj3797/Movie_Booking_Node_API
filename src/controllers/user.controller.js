const userService = require('../services/user.service');
const { errorResponseBody, successResponseBody } = require('../utils/responsebody');
const {STATUS}= require('../utils/constants');

const sanitizeUser = (user) => {
    if (!user) return user;
    const plainUser = user.toObject ? user.toObject() : { ...user };
    delete plainUser.password;
    return plainUser;
};

const update = async (req, res) => {
    try {
        const response = await userService.updateUserRoleOrStatus(req.body, req.params.id);

        return res.status(200).json({
            ...successResponseBody,
            data: sanitizeUser(response),
            message: 'Successfully updated the user'
        });
    } catch (error) {
        if(error.err) {
            return res.status(error.code || STATUS.BAD_REQUEST).json({
                ...errorResponseBody,
                err: error.err
            });
        }
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            ...errorResponseBody,
            err: error
        });
    }
}

module.exports = {
    update
}