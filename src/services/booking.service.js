const Booking = require('../models/booking.model');
const Theatre = require('../models/theatre.model');
const Movie = require('../models/movie.model');
const { BOOKING_STATUS, STATUS } = require('../utils/constants');



const createBooking = async (bookingDetails, userId) => {

    const { theatreId, movieId, timings, noOfSeats } = bookingDetails

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
        throw {
            code: STATUS.NOT_FOUND,
            message: "Theatre not found"
        };
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
        throw {
            code: STATUS.NOT_FOUND,
            message: "Movie not found"
        };
    }

    try {
        const response = await Booking.create({
            ...bookingDetails,
            userId,
            status: BOOKING_STATUS.PROCESSING
        });
        return response;
    }catch (error) {
        if (error.name === 'ValidationError') {
            const err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });

            throw {
                code: STATUS.UNPROCESSABLE_ENTITY,
                message: err
            };
        }
        throw error;
    }

}


const updateBooking=async(data,bookingId)=>{
    try{
        const response=await Booking.findByIdAndUpdate(bookingId,data,{
            new:true,
            runValidators:true
        });
        if(!response){
            throw {
                code: STATUS.NOT_FOUND,
                message: "No booking record found for the id provided"
            };
        }
        return response
    }catch(error){
        if (error.name === 'ValidationError') {
            const err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });

            throw {
                code: STATUS.UNPROCESSABLE_ENTITY,
                message: err
            };
        }
        throw error;
    }
}

const getBookings=async(data)=>{
    try {
        const response=await Booking.find(data);
        if(!response){
            throw {
                code: STATUS.NOT_FOUND,
                message: "No booking record found for the  userId provided"
            };
        }
        return response;
    }
    catch (error) {
        throw error;
    }
}

const getAllBookings=async()=>{
    try {
        const response=await Booking.find({});
        return response;
    }
    catch (error) {
        throw error;
    }
}

const getBookingById=async(id,userId)=>{
    try {
        const response=await Booking.findById(id);
        if(!response){
            throw {
                code: STATUS.NOT_FOUND,
                message: "No booking record found for the id provided"
            };
        }
        return response;
    }
    catch (error) {
        throw error;
    }
}

module.exports={
    createBooking,
    updateBooking,
    getBookings,
    getAllBookings,
    getBookingById
}