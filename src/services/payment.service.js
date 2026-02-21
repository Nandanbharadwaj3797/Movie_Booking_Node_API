const Payment= require('../models/payment.model');
const Booking= require('../models/booking.model');  
const { STATUS, PAYMENT_STATUS, BOOKING_STATUS } = require('../utils/constants');
const mongoose = require('mongoose');


const createPayment= async (data)=>{

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const expiryTime = new Date(Date.now() - 10 * 60 * 1000);
        
        const booking=await Booking.findOneAndUpdate(
            {_id:data.bookingId,
                status: BOOKING_STATUS.PENDING,
                createdAt: { $gte: expiryTime }
            },{
                $set: { status: BOOKING_STATUS.PROCESSING }
            },{new:true,session}
        );
        
        if(!booking){
            const existingPayment = await Payment.findOne({
                bookingId: data.bookingId,
                status: PAYMENT_STATUS.SUCCESSFUL
            }).session(session);

            if (existingPayment) {
                await session.commitTransaction();
                return existingPayment;
            }
            throw {
                code: STATUS.BAD_REQUEST,
                message: "Booking expired or not eligible for payment"
            };
        }

        if (Number(data.amount) !== Number(booking.totalCost)) {
            throw {
                code: STATUS.BAD_REQUEST,
                message: "Payment amount mismatch"
            };
        }

        const payment = await Payment.create(
            [{
                bookingId: booking._id,
                amount: data.amount,
                status: PAYMENT_STATUS.SUCCESSFUL
            }],
            { session }
        );

        const result=await Booking.updateOne(
            { _id: booking._id,
                status: BOOKING_STATUS.PROCESSING
            },
            { $set: 
                { status:BOOKING_STATUS.SUCCESSFUL }
            },{ session }
        );
        if(result.modifiedCount!==1){
            throw {
                code: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update booking status"
            };
        }
        await session.commitTransaction();
        return payment[0]; 

    }catch (error) {
        await session.abortTransaction();
        throw error;
    }finally {
        session.endSession();
    }
}

const getPaymentById=async(id)=>{
    try{
        const payment = await Payment.findById(id)
        .populate({
            path: 'bookingId',
            select: '-__v'
        });

        if(!payment){
            throw {
                code: STATUS.NOT_FOUND,
                message: "Payment record not found for the id provided"
            };
        }
        return payment;
    }
    catch (error) {
        throw error;
    }
    
}


module.exports={
    createPayment,
    getPaymentById
}