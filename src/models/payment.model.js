const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../utils/constants');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    // currency: {
    //     type: String,
    //     default: "INR"
    // },
    status: {
        type: String,
        required: true,
        enum: {
            values: [
                PAYMENT_STATUS.SUCCESSFUL,
                PAYMENT_STATUS.FAILED,
                PAYMENT_STATUS.PENDING,
                PAYMENT_STATUS.REFUNDED,
                PAYMENT_STATUS.PROCESSING
            ],
            message: "{VALUE} is not a valid payment status"
        },
        default: PAYMENT_STATUS.PENDING
    },
    // paymentMethod: {
    //     type: String,
    //     required: true
    // },
    // transactionId: {
    //     type: String,
    //     unique: true,
    //     sparse: true
    // }
}, { timestamps: true });

paymentSchema.index({ bookingId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
