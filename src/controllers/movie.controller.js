const movieService = require('../services/movie.service');
const { STATUS } = require('../utils/constants');
const { successResponse } = require('../utils/response');

/**
 * Controller function to create a new movie
 * @returns movie created
 */
const createMovie = async (req, res, next) => {
    try {
        const response = await movieService.createMovie(req.body);
        return successResponse(res, STATUS.CREATED, response, "Successfully created the movie");
    } catch (error) {
        next(error);
    }
};

const deleteMovie = async (req, res, next) => {
    try {
        const response = await movieService.deleteMovie(req.params.id);
        return successResponse(res, STATUS.OK, response, "Successfully deleted the given movie");
    } catch (error) {
        next(error);
    }
};

const getMovie = async (req, res, next) => {
    try {
        const response = await movieService.getMovieById(req.params.id);
        return successResponse(res, STATUS.OK, response, "Successfully fetched the given movie");
    } catch (error) {
        next(error);
    }
};

const updateMovie = async (req, res, next) => {
    try {
        const response = await movieService.updateMovie(req.params.id, req.body);
        return successResponse(res, STATUS.OK, response, "Successfully updated the movie");
    } catch (error) {
        next(error);
    }
};

const getMovies = async (req, res, next) => {
    try {
        const response = await movieService.fetchMovies(req.query);
        return successResponse(res, STATUS.OK, response, "Successfully fetched movies");
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createMovie,
    deleteMovie,
    getMovie,
    updateMovie,
    getMovies
}