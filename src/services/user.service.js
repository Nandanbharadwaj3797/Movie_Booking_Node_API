const { USER_ROLE, USER_STATUS,STATUS } = require('../utils/constants');
const User = require('../models/user.model');
const mongoose = require('mongoose');


const createUser = async (payload) => {
    try {
        const data = { ...payload };

        // Never trust client for role
        data.userRole = USER_ROLE.CUSTOMER;
        data.userStatus = USER_STATUS.APPROVED;

        const response = await User.create(data);
        return response;

    } catch (error) {

        if (error.name === "ValidationError") {
            const err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });

            throw { err, code: STATUS.BAD_REQUEST };
        }

        if (error.code === 11000) {
            throw {
                err: "Email already exists",
                code: STATUS.CONFLICT
            };
        }

        throw error;
    }
};

const getUserByEmail = async (email) => {
    if (!email) {
        throw {
            err: "Email is required",
            code: STATUS.BAD_REQUEST
        };
    }

    const user = await User.findOne({ email }).select("+password");
    return user; // return null if not found
};

const getUserById = async (id) => {

    if (!id) {
        throw { err: "User id is required", code: STATUS.BAD_REQUEST };
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw { err: "Invalid user id", code: STATUS.BAD_REQUEST };
    }

    const user = await User.findById(id);

    if (!user) {
        throw { err: "User not found", code: STATUS.NOT_FOUND };
    }

    return user;
};

const updateUserRoleOrStatus = async (payload, userId) => {

    if (!userId) {
        throw { err: "User id is required", code: STATUS.BAD_REQUEST };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw { err: "Invalid user id", code: STATUS.BAD_REQUEST };
    }

    const updateQuery = {};

    if (payload.userRole) {
        if (!Object.values(USER_ROLE).includes(payload.userRole)) {
            throw { err: "Invalid user role", code: STATUS.BAD_REQUEST };
        }
        updateQuery.userRole = payload.userRole;
    }

    if (payload.userStatus) {
        if (!Object.values(USER_STATUS).includes(payload.userStatus)) {
            throw { err: "Invalid user status", code: STATUS.BAD_REQUEST };
        }
        updateQuery.userStatus = payload.userStatus;
    }

    if (Object.keys(updateQuery).length === 0) {
        throw { err: "Nothing to update", code: STATUS.BAD_REQUEST };
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw { err: "User not found", code: STATUS.NOT_FOUND };
    }

    return updatedUser;
};


module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserRoleOrStatus
}