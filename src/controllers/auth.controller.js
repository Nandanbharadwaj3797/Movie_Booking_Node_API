const jwt = require('jsonwebtoken');

const userService = require('../services/user.service');
const { successResponseBody, errorResponseBody } = require('../utils/responsebody');

const sanitizeUser = (user) => {
    if (!user) return user;
    const plainUser = user.toObject ? user.toObject() : { ...user };
    delete plainUser.password;
    return plainUser;
};

const signup = async (req, res) => {
    try {
        const response = await userService.createUser(req.body);
        return res.status(201).json({
            ...successResponseBody,
            data: sanitizeUser(response),
            message: "Successfully registered a user"
        });
    } catch (error) {
        if(error.err) {
            return res.status(error.code).json({
                ...errorResponseBody,
                err: error.err
            });
        }
        return res.status(500).json({
            ...errorResponseBody,
            err: error
        });
    }
}

const signin = async (req, res) => {
    try {
        const user = await userService.getUserByEmail(req.body.email);
        const isValidPassword = await user.isValidPassword(req.body.password);
        if(!isValidPassword) {
            throw {err: 'Invalid password for the given email', code: 401};
        }
        const token = jwt.sign(
            {id: user.id, email: user.email}, 
            process.env.AUTH_KEY,
            {expiresIn: '1h'}
        );

        successResponseBody.message = "Successfully logged in";
        successResponseBody.data = {
            email: user.email,
            role: user.userRole,
            status: user.userStatus,
            token: token
        };

        return res.status(200).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            return res.status(error.code).json({
                ...errorResponseBody,
                err: error.err
            });
        }
        console.log(error);
        return res.status(500).json({
            ...errorResponseBody,
            err: error
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        const isOldPasswordCorrect = await user.isValidPassword(req.body.oldPassword);
        if(!isOldPasswordCorrect) {
            throw {err: 'Invalid old password, please write the correct old password', code: 403};
        }
        user.password = req.body.newPassword;
        await user.save();
        return res.status(200).json({
            ...successResponseBody,
            data: sanitizeUser(user),
            message: 'Successfully updated the password for the given user'
        });
    } catch (error) {
        if(error.err) {
            return res.status(error.code).json({
                ...errorResponseBody,
                err: error.err
            });
        }
        return res.status(500).json({
            ...errorResponseBody,
            err: error
        });
    }
}
module.exports = {
    signup,
    signin,
    resetPassword
}