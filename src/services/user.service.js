const { USER_ROLE, USER_STATUS,STATUS } = require('../utils/constants');
const User = require('../models/user.model');
const mongoose = require('mongoose');


const createUser = async (payload) => {
    try {
        const data = { ...payload };

        const role = data.userRole || USER_ROLE.customer;

        if (role === USER_ROLE.customer) {
            if (
                data.userStatus &&
                data.userStatus !== USER_STATUS.approved
            ) {
                throw {
                    err: "Customer status must be APPROVED",
                    code: STATUS.BAD_REQUEST
                };
            }
            data.userStatus = USER_STATUS.approved;
        }

        if (role !== USER_ROLE.customer) {
            data.userStatus = USER_STATUS.pending;
        }

        data.userRole = role;

        const response = await User.create(data);
        return response;

    } catch (error) {

        if (error.name === 'ValidationError') {
            const err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw { err, code: STATUS.BAD_REQUEST };
        }

        if (error.code === STATUS.DUPLICATE_KEY_ERROR) {
            throw {
                err: "Email already exists",
                code: STATUS.CONFLICT
            };
        }

        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        if (!email) {
            throw {
                err: "Email is required",
                code: STATUS.BAD_REQUEST
            };
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw {
                err: "No user found for the given email",
                code: STATUS.NOT_FOUND
            };
        }

        return user;

    } catch (error) {
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        if (!id) {
            throw {
                err: "User id is required",
                code: STATUS.BAD_REQUEST
            };
        }

        // prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                err: "Invalid user id",
                code: STATUS.BAD_REQUEST
            };
        }

        const user = await User.findById(id);

        if (!user) {
            throw {
                err: "No user found for the given id",
                code: STATUS.NOT_FOUND
            };
        }

        return user;

    } catch (error) {
        throw error;
    }
};

const updateUserRoleOrStatus = async (payload, userId) => {
    try {
        if (!userId) {
            throw {
                err: 'User id is required',
                code: STATUS.BAD_REQUEST
            };
        }

        // prevent CastError
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw {
                err: 'Invalid user id',
                code: STATUS.BAD_REQUEST
            };
        }

        const updateQuery = {};

        if (payload.userRole) {
            updateQuery.userRole = payload.userRole;
        }

        if (payload.userStatus) {
            updateQuery.userStatus = payload.userStatus;
        }

        // nothing to update
        if (Object.keys(updateQuery).length === 0) {
            throw {
                err: 'Nothing to update',
                code: STATUS.BAD_REQUEST
            };
        }

        const response = await User.findByIdAndUpdate(
            userId,
            updateQuery,
            {new: true, runValidators: true}
        );

        if (!response) {
            throw {
                err: 'No user found for the given id',
                code: STATUS.NOT_FOUND
            };
        }

        return response;

    } catch (error) {

        if (error.name === 'ValidationError') {
            const err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {
                err,
                code: STATUS.BAD_REQUEST
            };
        }

        throw error;
    }
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserRoleOrStatus
}