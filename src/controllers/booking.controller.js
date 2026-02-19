const {STATUS}=require('../utils/constants');
const { successResponse } = require('../utils/response');
const bookingService=require('../services/booking.service');
const create=async(req,res,next)=>{
    try {
        let userId=req.user;

        const response=await bookingService.createBooking(req.body,userId);
        return successResponse(
            res,
            STATUS.CREATED,
            response,
            "Booking created successfully"
        );

    } catch (error) {
        next(error);
    }

}

const update=async(req,res,next)=>{
    try {
        const response=await bookingService.updateBooking(req.body,req.params.id);
        return successResponse(
            res,
            STATUS.OK,
            response,
            "Booking updated successfully"
        );

    } catch (error) {
        next(error);
    }
}

const getBookings=async(req,res,next)=>{
    try {
        const response=await bookingService.getBookings({userId:req.user._id});
        return successResponse(
            res,
            STATUS.OK,
            response,
            "Bookings fetched successfully"
        );

    } catch (error) {
        next(error);
    }
}

const getAllBookings=async(req,res,next)=>{
    try {
        const response=await bookingService.getAllBookings();
        return successResponse(
            res,
            STATUS.OK,
            response,
            "All Bookings fetched successfully"
        );
    } catch (error) {
        next(error);
    }
}


const getBookingById=async(req,res,next)=>{
    try {
        const response=await bookingService.getBookingById(req.params.id,req.user._id);
        return successResponse(
            res,
            STATUS.OK,
            response,
            "Booking fetched successfully"
        );
    } catch (error) {
        next(error);
    }
}


module.exports={
    create,
    update,
    getBookings,
    getAllBookings,
    getBookingById
}