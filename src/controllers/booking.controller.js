const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');
const bookingService = require('../services/booking.service');

const create = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const response = await bookingService.createBooking(req.body, userId);
    sendSuccess(res, STATUS.CREATED, response, "Booking created successfully");
});

const update = asyncHandler(async (req, res) => {
    const response = await bookingService.updateBooking(req.params.id, req.body, req.user._id);
    sendSuccess(res, STATUS.OK, response, "Booking updated successfully");
});

const getBookings = asyncHandler(async (req, res) => {
    const response = await bookingService.getBookings({ userId: req.user._id });
    sendSuccess(res, STATUS.OK, response, "Bookings fetched successfully");
});

const getAllBookings = asyncHandler(async (req, res) => {
    const response = await bookingService.getAllBookings();
    sendSuccess(res, STATUS.OK, response, "All Bookings fetched successfully");
});

const getBookingById = asyncHandler(async (req, res) => {
    const response = await bookingService.getBookingById(req.params.id, req.user._id);
    sendSuccess(res, STATUS.OK, response, "Booking fetched successfully");
});


module.exports={
    create,
    update,
    getBookings,
    getAllBookings,
    getBookingById
}