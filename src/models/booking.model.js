const mongose = require('mongoose');
const { Booking_STATUS } = require('../utils/constants');

const bookingSchema = new mongose.Schema({
    theatreId: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    movieId: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    userId: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timing:{
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
    type: {
        type: String,
        required: true,
        enum:{
            values:[Booking_STATUS.PROCESSING, Booking_STATUS.SUCCESSFUL, Booking_STATUS.CANCELLED],
            message: "{VALUE} is not a valid booking status"
        },
        default: Booking_STATUS.PROCESSING
    }
}, {timestamps: true});

const Booking = mongose.model('Booking', bookingSchema);

module.exports = Booking;