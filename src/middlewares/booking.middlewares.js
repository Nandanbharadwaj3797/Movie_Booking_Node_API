const { STATUS, USER_ROLE, BOOKING_STATUS } = require("../utils/constants");
const { ErrorResponse } = require("../utils/response");
const mongoose = require("mongoose");


const validateBookingCreateRequest = (req, res, next) => {

    const { showId, noOfSeats } = req.body;
    const errors = {};

    if (!showId) {
        errors.showId = "showId is required";
    } else if (!mongoose.Types.ObjectId.isValid(showId)) {
        errors.showId = "Invalid showId format";
    }

    if (noOfSeats === undefined) {
        errors.noOfSeats = "noOfSeats is required";
    } else if (!Number.isInteger(noOfSeats) || noOfSeats <= 0) {
        errors.noOfSeats = "noOfSeats must be a positive integer";
    }

    if (Object.keys(errors).length > 0) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            errors,
            "Invalid booking request"
        );
    }

    next();
};

const canChangeStatus = async (req, res, next) => {

    try {

        const user = req.user;   
        const { status } = req.body;

        if (!status) {
            return ErrorResponse(
                res,
                STATUS.BAD_REQUEST,
                {},
                "Status is required"
            );
        }

        const isCustomer = user.userRole === USER_ROLE.CUSTOMER;
        const isAdmin = user.userRole === USER_ROLE.ADMIN;

        if (!isCustomer && !isAdmin) {
            return ErrorResponse(
                res,
                STATUS.FORBIDDEN,
                {},
                "You are not allowed to change booking status"
            );
        }

        // Validate status enum
        if (!Object.values(BOOKING_STATUS).includes(status)) {
            return ErrorResponse(
                res,
                STATUS.BAD_REQUEST,
                {},
                "Invalid booking status value"
            );
        }

        // Customers can only cancel
        if (isCustomer && status !== BOOKING_STATUS.CANCELLED) {
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