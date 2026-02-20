const showService=require('../services/show.service');
const { STATUS } = require('../utils/constants');
const { successResponse } = require('../utils/response');   


const create=async(req,res,next)=>{
    try {
        const response=await showService.createShow(req.body);
        return successResponse(res, STATUS.CREATED, response, "Successfully created the show");
    } catch (error) {
        next(error);
    }
}

module.exports={
    create
}