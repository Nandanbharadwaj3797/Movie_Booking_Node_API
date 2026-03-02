const movieService = require('../services/movie.service');
const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');

/**
 * Create a new movie
 */
const createMovie = asyncHandler(async (req, res) => {
    const response = await movieService.createMovie(req.body);
    sendSuccess(res, STATUS.CREATED, response, "Successfully created the movie");
});

/**
 * Delete a movie
 */
const deleteMovie = asyncHandler(async (req, res) => {
    const response = await movieService.deleteMovie(req.params.id);
    sendSuccess(res, STATUS.OK, response, "Successfully deleted the given movie");
});

/**
 * Get a single movie
 */
const getMovie = asyncHandler(async (req, res) => {
    const response = await movieService.getMovieById(req.params.id);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched the given movie");
});

/**
 * Update a movie
 */
const updateMovie = asyncHandler(async (req, res) => {
    const response = await movieService.updateMovie(req.params.id, req.body);
    sendSuccess(res, STATUS.OK, response, "Successfully updated the movie");
});

/**
 * Get all movies
 */
const getMovies = asyncHandler(async (req, res) => {
    const response = await movieService.fetchMovies(req.query);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched movies");
});


module.exports = {
    createMovie,
    deleteMovie,
    getMovie,
    updateMovie,
    getMovies
}