const jwt = require("jsonwebtoken");
const { STATUS } = require("../utils/constants");
const userService = require("../services/user.service");
const { successResponse } = require("../utils/response");

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


/**
 * SIGNUP
 */
const signup = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);

        return successResponse(
            res,
            STATUS.CREATED,
            sanitizeUser(user),
            "User created successfully"
        );
    } catch (error) {
        next(error);
    }
};


/**
 * SIGNIN
 */
const signin = async (req, res, next) => {
    try {
        const user = await userService.getUserByEmail(req.body.email);

        // Prevent crash & user enumeration
        if (!user) {
            return next({
                err: "Invalid email or password",
                code: STATUS.UNAUTHORIZED
            });
        }

        const isValidPassword = await user.isValidPassword(req.body.password);

        if (!isValidPassword) {
            return next({
                err: "Invalid email or password",
                code: STATUS.UNAUTHORIZED
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.userRole,
                status: user.userStatus
            },
            process.env.AUTH_KEY,
            { expiresIn: "1h" }
        );

        return successResponse(
            res,
            STATUS.OK,
            {
                email: user.email,
                role: user.userRole,
                status: user.userStatus,
                token
            },
            "Successfully logged in"
        );

    } catch (error) {
        next(error);
    }
};


/**
 * RESET PASSWORD
 */
const resetPassword = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);

        if (!user) {
            return next({
                err: "User not found",
                code: STATUS.NOT_FOUND
            });
        }

        const isOldPasswordCorrect = await user.isValidPassword(
            req.body.oldPassword
        );

        if (!isOldPasswordCorrect) {
            return next({
                err: "Invalid old password",
                code: STATUS.BAD_REQUEST
            });
        }

        user.password = req.body.newPassword;
        await user.save(); // pre-save hook hashes password

        return successResponse(
            res,
            STATUS.OK,
            {},
            "Password reset successfully"
        );

    } catch (error) {
        next(error);
    }
};


/**
 * LOGOUT
 */
const logout = async (req, res, next) => {
    try {
        return successResponse(
            res,
            STATUS.OK,
            {},
            "Successfully logged out"
        );
    } catch (error) {
        next(error);
    }
};


module.exports = {
    signup,
    signin,
    resetPassword,
    logout
};