const paymentService = require('../services/payment.service');
const { STATUS } = require('../utils/constants');
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

const getPaymentDetails = async (req, res, next) => {
    try {
        const response = await paymentService.getPaymentById(req.params.id);
        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully fetched the payment details"
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getPaymentDetails
}