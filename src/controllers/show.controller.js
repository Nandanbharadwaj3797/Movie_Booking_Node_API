const showService=require('../services/show.service');
const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');

const create=asyncHandler(async(req,res)=>{
    const response=await showService.createShow(req.body);
    sendSuccess(res, STATUS.CREATED, response, "Successfully created the show");
});

const getShows=asyncHandler(async(req,res)=>{
    const response=await showService.getShows(req.query);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched shows");
});

const destroy=asyncHandler(async(req,res)=>{
    const response=await showService.deleteShow(req.params.id);
    sendSuccess(res, STATUS.OK, response, "Successfully deleted the show");
});

const update=asyncHandler(async(req,res)=>{
    const response=await showService.updateShow(req.params.id,req.body);
    sendSuccess(res, STATUS.OK, response, "Successfully updated the show");
});

module.exports={
    create,
    getShows,
    destroy,
    update
}