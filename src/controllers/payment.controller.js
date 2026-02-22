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

const getAllPayments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const response = await paymentService.getAllPayments(
            userId,
            page,
            limit
        );

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully fetched payment details"
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getPaymentDetails,
    getAllPayments
}