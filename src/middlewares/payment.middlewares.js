const { STATUS } = require("../utils/constants");
const { ErrorResponse } = require("../utils/response");
const mongoose = require("mongoose");

const verifyPaymentCreateRequest = (req, res, next) => {
  try {
    const { bookingId, idempotencyKey } = req.body;

    const errors = {};

    //  bookingId required
    if (!bookingId) {
      errors.bookingId = "bookingId is required";
    } 
    // bookingId must be valid ObjectId
    else if (!mongoose.Types.ObjectId.isValid(bookingId.toString().trim())) {
      errors.bookingId = "Invalid bookingId format";
    }

    //  Optional idempotencyKey validation
    if (idempotencyKey && typeof idempotencyKey !== "string") {
      errors.idempotencyKey = "idempotencyKey must be a string";
    }

    // If any validation errors
    if (Object.keys(errors).length > 0) {
      return next({
        code: STATUS.BAD_REQUEST,
        message: "Invalid payment request",
        errors
      });
    }

    // Normalize bookingId
    req.body.bookingId = bookingId.toString().trim();

    next();

  } catch (error) {
    next(error);
  }
};


const verifyPaymentIdParam = async (req, res, next) => {

    const paymentId = req.params.id;

    if (!paymentId) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { paymentId: "paymentId is required" },
            "Invalid payment request"
        );
    }

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { paymentId: "Invalid paymentId format" },
            "Invalid payment request"
        );
    }

    next();
};

module.exports={
    verifyPaymentCreateRequest,
    verifyPaymentIdParam
};