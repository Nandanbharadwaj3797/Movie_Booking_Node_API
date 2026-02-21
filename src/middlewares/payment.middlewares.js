const { PAYMENT_STATUS } = require("../utils/constants");
const { ErrorResponse } = require("../utils/response");
const mongoose = require("mongoose");
const verifyPaymentCreateRequest=async(req,res,next)=>{
     const { bookingId, amount } = req.body;

    if (!bookingId) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { bookingId: "bookingId is required" },
            "Invalid payment request"
        );
    }

    
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { bookingId: "Invalid bookingId format" },
            "Invalid payment request"
        );
    }

    if (amount === undefined || amount === null) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { amount: "amount is required" },
            "Invalid payment request"
        );
    }

    if (isNaN(amount) || Number(amount) <= 0) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { amount: "amount must be a positive number" },
            "Invalid payment request"
        );
    }



    next();
}

module.exports={verifyPaymentCreateRequest};