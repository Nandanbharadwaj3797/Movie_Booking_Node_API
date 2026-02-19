const { STATUS, USER_ROLE,BOOKING_STATUS } = require("../utils/constants");
const { ErrorResponse } = require("../utils/response");
const mongoose = require("mongoose");
const userService = require("../services/user.service");

const validateBookingCreateRequest = (req, res, next) => {
    const { theatreId, movieId, timings, noOfSeats } = req.body;

    // Required fields
    if (!theatreId) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { theatreId: "theatreId is required" },
            "Invalid booking request"
        );
    }

    if (!movieId) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { movieId: "movieId is required" },
            "Invalid booking request"
        );
    }

    if (!timings) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { timings: "timing is required" },
            "Invalid booking request"
        );
    }

    if (!noOfSeats || noOfSeats <= 0) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { noOfSeats: "noOfSeats must be greater than 0" },
            "Invalid booking request"
        );
    }

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(theatreId)) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { theatreId: "Invalid theatreId format" },
            "Invalid booking request"
        );
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { movieId: "Invalid movieId format" },
            "Invalid booking request"
        );
    }

    next();
};


const canChangeStatus = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user);
        const { status } = req.body;

        const isCustomer = user.role === USER_ROLE.CUSTOMER;
        const isAdmin = user.role === USER_ROLE.ADMIN;

        if (!isCustomer && !isAdmin) {
            return ErrorResponse(
                res,
                STATUS.FORBIDDEN,
                {},
                "You are not allowed to change booking status"
            );
        }

        if (isCustomer && status &&status !== BOOKING_STATUS.CANCELLED) {
            return ErrorResponse(
                res,
                STATUS.FORBIDDEN,
                {},
                "Customers can only cancel bookings"
            );
        }

        next();

    } catch (error) {
        next(error);
    }
};


module.exports = {
    validateBookingCreateRequest,
    canChangeStatus
};
