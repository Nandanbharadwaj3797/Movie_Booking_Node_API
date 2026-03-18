const paymentService = require('../services/payment.service');
const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');

const sendMail=require('../services/email.service');

const create = asyncHandler(async (req, res) => {
    const response = await paymentService.createPayment(req.body, req.user);
    sendSuccess(res, STATUS.CREATED, response, "Successfully created the payment");

    // Fire-and-forget notification after successful payment.
    sendMail(
        req.user.email,
        'Your booking is successful',
        `Your payment has been received successfully. Payment ID: ${response._id}. Amount: ${response.amount}.`
    ).catch((err) => {
        console.error('Payment confirmation email failed:', err.message);
    });
});

const getPaymentDetails = asyncHandler(async (req, res) => {
    const response = await paymentService.getPaymentById(req.params.id, req.user);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched the payment details");
});

const getAllPayments = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const response = await paymentService.getAllPayments(userId, page, limit);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched all payments");
});

module.exports = {
    create,
    getPaymentDetails,
    getAllPayments
}