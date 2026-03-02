const theatreService = require('../services/theatre.service');
const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');

/**
 * Create Theatre
 */
const create = asyncHandler(async (req, res) => {
    const response = await theatreService.createTheatre(req.body);
    sendSuccess(res, STATUS.CREATED, response, "Successfully created the theatre");
});

/**
 * Delete Theatre
 */
const destroy = asyncHandler(async (req, res) => {
    const response = await theatreService.deleteTheatre(req.params.id);
    sendSuccess(res, STATUS.OK, response, "Successfully deleted the given theatre");
});

/**
 * Get Single Theatre
 */
const getTheatre = asyncHandler(async (req, res) => {
    const response = await theatreService.getTheatreByID(req.params.id);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched theatre");
});
        
/**
 * Get All Theatres
 */
const getTheatres = asyncHandler(async (req, res) => {
    const response = await theatreService.getAllTheatres(req.query);
    sendSuccess(res, STATUS.OK, response, "Successfully fetched all theatres");
});

/**
 * Update Theatre
 */
const update = asyncHandler(async (req, res) => {
    const response = await theatreService.updateTheatre(req.params.id, req.body);
    sendSuccess(res, STATUS.OK, response, "Successfully updated the theatre");
});


/**
 * Update Movies in Theatre
 */
const updateMovies = async (req, res, next) => {
    try {
        const response = await theatreService.updateMoviesInTheatres(
            req.params.id,
            req.body.movieIds,
            req.body.insert
        );

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully updated movies in theatre"
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Get Movies in Theatre
 */
const getMovies = async (req, res, next) => {
    try {
        const response = await theatreService.getMoviesInATheatre(req.params.id);

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully fetched movies"
        );


    } catch (error) {
        next(error);
    }
};

/**
 * Check Movie in Theatre
 */
const checkMovie = async (req, res, next) => {
    try {
        const response = await theatreService.checkMovieInATheatre(
            req.params.theatreId,
            req.params.movieId
        );

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully checked movie presence"
        );


    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    destroy,
    getTheatre,
    getTheatres,
    update,
    updateMovies,
    getMovies,
    checkMovie
};
