const Payment= require('../models/payment.model');
const Booking= require('../models/booking.model');  
const { STATUS, PAYMENT_STATUS, BOOKING_STATUS, USER_ROLE } = require('../utils/constants');
const mongoose = require('mongoose');
const User = require('../models/user.model');

const createPayment = async (data, requestUser) => {

    const session = await mongoose.startSession();

    try {
        let createdPayment;

        await session.withTransaction(async () => {

            const booking = await Booking.findOne({
                _id: data.bookingId,
                status: BOOKING_STATUS.PENDING,
                expiresAt: { $gt: new Date() }
            }).session(session);

            if (!booking) {
                throw {
                    code: STATUS.BAD_REQUEST,
                    message: "Booking expired or not eligible for payment"
                };
            }

            const isAdmin = requestUser?.userRole === USER_ROLE.ADMIN;
            const isBookingOwner = booking.userId?.toString() === requestUser?._id?.toString();

            if (!isAdmin && !isBookingOwner) {
                throw {
                    code: STATUS.FORBIDDEN,
                    message: "Not allowed to pay for this booking"
                };
            }

            
            const existingPayment = await Payment.findOne({
                bookingId: booking._id,
                status: PAYMENT_STATUS.SUCCESSFUL
            }).session(session);

            if (existingPayment) {
                createdPayment = existingPayment;
                return;
            }

            const payment = await Payment.create([{
                bookingId: booking._id,
                amount: booking.totalCost,
                status: PAYMENT_STATUS.SUCCESSFUL
            }], { session });

            createdPayment = payment[0];

            booking.status = BOOKING_STATUS.CONFIRMED;
            await booking.save({ session });
        });

        return createdPayment;

    } catch (error) {
        throw error;
    } finally {
        session.endSession();
    }
};

const getPaymentById=async(id, requestUser)=>{
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

        const isAdmin = requestUser?.userRole === USER_ROLE.ADMIN;
        const bookingId = payment.bookingId?._id || payment.bookingId;
        const booking = await Booking.findById(bookingId).select('userId').lean();
        const bookingOwnerId = booking?.userId?.toString();
        const requestUserId = requestUser?._id?.toString();

        if (!isAdmin && bookingOwnerId !== requestUserId) {
            throw {
                code: STATUS.FORBIDDEN,
                message: "Not allowed to access this payment"
            };
        }

        return payment;
    }
    catch (error) {
        throw error;
    }
    
}

const getAllPayments=async(userId,page=1,limit=10)=>{
    try{

        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
        const skip = (page - 1) * limit;


        const user=await User.findById(userId).select("userRole").lean();

        if(!user){
            throw {
                code: STATUS.NOT_FOUND,
                message: "User not found"
            };
        }

        if(user.userRole === USER_ROLE.ADMIN){
            const [total, payments] = await Promise.all([
                Payment.countDocuments(),
                Payment.find()
                    .populate({
                        path: 'bookingId', select: '-__v' 
                    })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()
            ]);

            return {
                totalResults: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                results: payments
            };
        }

        const objectUserId = new mongoose.Types.ObjectId(userId);

        const result = await Payment.aggregate([
            {
                $lookup: {
                    from: "bookings",
                    let: { bookingId: "$bookingId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$bookingId"] },
                                        { $eq: ["$userId", objectUserId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "booking"
                }
            },
            { $unwind: "$booking" },
            {
                $project: {
                    bookingId: 1,
                    amount: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    booking: 1
                }
            },

            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            }
        ]);

        const total = result[0]?.metadata[0]?.total || 0;
        const payments = result[0]?.data || [];

        return {
            totalResults: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            results: payments
        };
    }catch (error) {
        throw error;
    }
}

module.exports={
    createPayment,
    getPaymentById,
    getAllPayments
}