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
    status: {
        type: String,
        required: true,
        enum: {
            values: [PAYMENT_STATUS.SUCCESSFUL, PAYMENT_STATUS.FAILED,PAYMENT_STATUS.PENDING],
            message: "{VALUE} is not a valid payment status"
        },
        default: PAYMENT_STATUS.PENDING
    },
}, {timestamps: true});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;