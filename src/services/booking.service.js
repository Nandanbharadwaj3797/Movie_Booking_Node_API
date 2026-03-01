const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');
const { BOOKING_STATUS, STATUS } = require('../utils/constants');

const createBooking = async (bookingDetails, userId) => {

    const session = await mongoose.startSession();

    try {
        let createdBooking;

        await session.withTransaction(async () => {

            const { showId, noOfSeats, idempotencyKey } = bookingDetails;

            if (!mongoose.Types.ObjectId.isValid(showId)) {
                throw {
                    code: STATUS.BAD_REQUEST,
                    message: "Invalid showId format"
                };
            }

            if (!Number.isInteger(noOfSeats) || noOfSeats <= 0) {
                throw {
                    code: STATUS.BAD_REQUEST,
                    message: "Invalid number of seats"
                };
            }

            if (idempotencyKey) {
                const existingBooking = await Booking.findOne({ idempotencyKey }).session(session);
                if (existingBooking) {
                    createdBooking = existingBooking;
                    return;
                }
            }

            const show = await Show.findOneAndUpdate(
                { _id: showId, noOfSeats: { $gte: noOfSeats } },
                { $inc: { noOfSeats: -noOfSeats } },
                { new: true, session }
            );

            if (!show) {
                throw {
                    code: STATUS.BAD_REQUEST,
                    message: "Not enough seats available or show not found"
                };
            }

            const totalCost = show.price * noOfSeats;

            const booking = await Booking.create([{
                userId,
                showId,
                noOfSeats,
                totalCost,
                status: BOOKING_STATUS.PENDING,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                idempotencyKey
            }], { session });

            createdBooking = booking[0];
        });

        return createdBooking;

    } finally {
        session.endSession();
    }
};


const updateBooking = async (bookingId, data, userId) => {

    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
        throw {
            code: STATUS.NOT_FOUND,
            message: "Booking not found"
        };
    }

    const allowedTransitions = {
        [BOOKING_STATUS.PENDING]: [
            BOOKING_STATUS.CONFIRMED,
            BOOKING_STATUS.FAILED,
            BOOKING_STATUS.CANCELLED,
            BOOKING_STATUS.EXPIRED
        ],
        [BOOKING_STATUS.CONFIRMED]: [],
        [BOOKING_STATUS.FAILED]: [],
        [BOOKING_STATUS.CANCELLED]: [],
        [BOOKING_STATUS.EXPIRED]: []
    };

    const newStatus = data.status;

    if (!allowedTransitions[booking.status]?.includes(newStatus)) {
        throw {
            code: STATUS.BAD_REQUEST,
            message: `Invalid status transition from ${booking.status} to ${newStatus}`
        };
    }

    booking.status = newStatus;
    await booking.save();

    return booking;
};


const getBookings = async (filter) => {
    return await Booking.find(filter).sort({ createdAt: -1 }).lean();
};



const getAllBookings = async () => {
    return await Booking.find({}).sort({ createdAt: -1 });
};


const getBookingById = async (id, userId, role) => {

    const query = role === "ADMIN"
        ? { _id: id }
        : { _id: id, userId };

    const booking = await Booking.findOne(query);

    if (!booking) {
        throw {
            code: STATUS.NOT_FOUND,
            message: "Booking not found"
        };
    }

    return booking;
}

module.exports = {
    createBooking,
    updateBooking,
    getBookings,
    getAllBookings,
    getBookingById
};