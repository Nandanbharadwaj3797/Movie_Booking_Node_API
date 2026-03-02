const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../utils/constants');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: {
            values:Object.values(PAYMENT_STATUS),
            message: "{VALUE} is not a valid payment status"
        },
        default: PAYMENT_STATUS.PENDING,
        required: true
    },
    transactionId: {
        type: String,
        index: true
    },
    idempotencyKey: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

paymentSchema.index(
    { bookingId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: PAYMENT_STATUS.SUCCESSFUL }
    }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
