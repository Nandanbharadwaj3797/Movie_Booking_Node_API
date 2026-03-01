const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../utils/constants');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true,
        index: true
    },
    noOfSeats: {
        type: Number,
        required: true,
        min: 1
    },
    totalCost: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: {
            values: [
                BOOKING_STATUS.PENDING,
                BOOKING_STATUS.CONFIRMED,
                BOOKING_STATUS.FAILED,
                BOOKING_STATUS.CANCELLED,
                BOOKING_STATUS.EXPIRED
            ],
            message: "{VALUE} is not a valid booking status"
        },
        default: BOOKING_STATUS.PENDING,
        index: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    idempotencyKey: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ showId: 1, status: 1 });

/* Expiry worker optimized index */
bookingSchema.index(
  { expiresAt: 1 },
  { partialFilterExpression: { status: BOOKING_STATUS.PENDING } }
);

/* Prevent duplicate active booking */
bookingSchema.index(
  { userId: 1, showId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: BOOKING_STATUS.PENDING }
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
