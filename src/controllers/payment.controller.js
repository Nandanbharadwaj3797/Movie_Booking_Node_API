const paymentService = require('../services/payment.service');
const { STATUS, BOOKING_STATUS } = require('../utils/constants');
const { successResponse } = require('../utils/response');



const create = async (req, res, next) => {
    try {
        const response = await paymentService.createPayment(req.body);
        return successResponse(
            res,
            STATUS.CREATED,
            response,
            "Successfully created the payment"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create
}