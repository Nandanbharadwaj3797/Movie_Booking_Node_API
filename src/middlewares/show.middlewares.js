const { STATUS } = require('../utils/constants');
const { ErrorResponse } = require("../utils/response");
const mongoose = require("mongoose");

const validateCreateShowRequest=async (req,res,next)=>{
    if(!req.body.theatreId){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { theatreId: "theatreId is required" },
            "Invalid show request"
        );
    }

    if(!req.body.movieId){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { movieId: "movieId is required" },
            "Invalid show request"
        );
    }

    if(!req.body.timings){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { timings: "timing is required" },
            "Invalid show request"
        );
    }

    let errors = {};
    if (req.body.noOfSeats === undefined) {
        errors.noOfSeats = "noOfSeats is required";
    } else if (!Number.isInteger(req.body.noOfSeats) || req.body.noOfSeats < 0) {
        errors.noOfSeats = "noOfSeats must be a non-negative integer";
    }

    if (req.body.price === undefined) {
        errors.price = "price is required";
    } else if (isNaN(req.body.price) || Number(req.body.price) < 0) {
        errors.price = "price must be a non-negative number";
    }

    if (Object.keys(errors).length > 0) {
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            errors,
            "Invalid show request"
        );
    }

    if(!mongoose.Types.ObjectId.isValid(req.body.theatreId)){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { theatreId: "Invalid theatreId format" },
            "Invalid show request"
        );
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId)){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { movieId: "Invalid movieId format" },
            "Invalid show request"
        );
    }
    next();
}

const validateGetShowsRequest=async (req,res,next)=>{
    if(req.query.theatreId && !mongoose.Types.ObjectId.isValid(req.query.theatreId)){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { theatreId: "Invalid theatreId format" },
            "Invalid show request"
        );
    }
    if(req.query.movieId && !mongoose.Types.ObjectId.isValid(req.query.movieId)){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { movieId: "Invalid movieId format" },
            "Invalid show request"
        );
    }
    next();
}

const validateUpdateShowRequest=async (req,res,next)=>{
    if(req.body.theatreId || req.body.movieId){
        return ErrorResponse(
            res,
            STATUS.BAD_REQUEST,
            { message: "Cannot update theatreId or movieId of the show" },
            "Invalid show update request"
        );
    }
    next();
}

module.exports={
    validateCreateShowRequest,
    validateGetShowsRequest,
    validateUpdateShowRequest
}