const Show=require('../models/show.model');
const Theatre=require('../models/theatre.model');
const { STATUS } = require('../utils/constants');

/** * Service function to create a new show.
 * @param {Object} data - The data for the new show.
 * @returns {Promise<Object>} - The created show object.
 * @throws {Object} - An error object with code and message if validation fails or other errors occur.
 */
const createShow=async(data)=>{
    try {
        const theatre=await Theatre.findById(data.theatreId);
        if(!theatre){
            throw {
                code: STATUS.NOT_FOUND,
                message: "Theatre not found"
            };
        }

        if (!theatre.movies.some(movie => movie.equals(data.movieId))) {
            throw {
                code: STATUS.BAD_REQUEST,
                message: "Movie not found in the theatre"
            };
        }



        const response=await Show.create(data);
        return response;
    } catch (error) {
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


const getShows=async(data)=>{
    try {
        let filters={};
        if(data.theatreId){
            filters.theatreId=data.theatreId;
        }
        if(data.movieId){
            filters.movieId=data.movieId;
        }

        const response=await Show.find(filters);
        if(response.length===0){
            throw {
                code: STATUS.NOT_FOUND,
                message: "No shows found"
            };
        }
        return response;
    } catch (error) {
        throw error;
    }
}
module.exports={
    createShow,
    getShows
}