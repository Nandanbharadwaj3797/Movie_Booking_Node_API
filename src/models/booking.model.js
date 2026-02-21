const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../utils/constants');

const bookingSchema = new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timings: {
        type: String,
        required: true
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
                BOOKING_STATUS.PROCESSING,
                BOOKING_STATUS.SUCCESSFUL,
                BOOKING_STATUS.CANCELLED
            ],
            message: "{VALUE} is not a valid booking status"
        },
        default: BOOKING_STATUS.PROCESSING
    }
}, { timestamps: true });

bookingSchema.index({ theatreId: 1, movieId: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
