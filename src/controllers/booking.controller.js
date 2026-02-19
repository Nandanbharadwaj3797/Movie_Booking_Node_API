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
            response,"Booking created successfully"
        );

    } catch (error) {
        next(error);
    }

}

module.exports={
    create
}