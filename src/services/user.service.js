const { USER_ROLE, USER_STATUS } = require('../utils/constants');
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
                    code: 400
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
            throw { err, code: 400 };
        }

        if (error.code === 11000) {
            throw {
                err: "Email already exists",
                code: 409
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
                code: 400
            };
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw {
                err: "No user found for the given email",
                code: 404
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
                code: 400
            };
        }

        // prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                err: "Invalid user id",
                code: 400
            };
        }

        const user = await User.findById(id);

        if (!user) {
            throw {
                err: "No user found for the given id",
                code: 404
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
                code: 400
            };
        }

        // prevent CastError
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw {
                err: 'Invalid user id',
                code: 400
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
                code: 400
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
                code: 404
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
                code: 400
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