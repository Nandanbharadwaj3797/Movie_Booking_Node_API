const theatreService = require('../services/theatre.service');
const { STATUS } = require('../utils/constants');
const { successResponse } = require('../utils/response');

/**
 * Create Theatre
 */
const create = async (req, res, next) => {
    try {
        const response = await theatreService.createTheatre(req.body);

        return successResponse(
            res,
            STATUS.CREATED,
            response, "Successfully created the theatre"
        );

    } catch (error) {
        next(error);
    }
};

/**
 * Delete Theatre
 */
const destroy = async (req, res, next) => {
    try {
        const response = await theatreService.deleteTheatre(req.params.id);

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully deleted the given theatre"
        );


    } catch (error) {
        next(error);
    }
};

/**
 * Get Single Theatre
 */
const getTheatre = async (req, res, next) => {
    try {
        const response = await theatreService.getTheatre(req.params.id);

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully fetched theatre"
        );


    } catch (error) {

        next(error);
    }
};
        
/**
 * Get All Theatres
 */
const getTheatres = async (req, res, next) => {
    try {
        const response = await theatreService.getAllTheatres(req.query);

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully fetched all theatres"
        );


    } catch (error) {
        next(error);
    }
};

/**
 * Update Theatre
 */
const update = async (req, res, next) => {
    try {
        const response = await theatreService.updateTheatre(req.params.id, req.body);

        return successResponse(
            res,
            STATUS.OK,
            response,
            "Successfully updated the theatre"
        );


    } catch (error) {
        next(error);
    }
};

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
