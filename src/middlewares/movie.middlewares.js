const badRequestResponse = {
    success: false,
    err: "",
    data: {},
    message: "Malformed Request | Bad Request"
};

const {STATUS}=require('../utils/constants');
const validateMovieCreateRequest = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "Request body is missing"
        });
    }

    const {
        name,
        description,
        casts,
        trailerUrl,
        releaseDate,
        director
    } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The name of the movie is not present or invalid"
        });
    }

    if (!description || typeof description !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The description of the movie is not present or invalid"
        });
    }

    if (!Array.isArray(casts) || casts.length === 0) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The casts of the movie must be a non-empty array"
        });
    }

    if (!trailerUrl || typeof trailerUrl !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The trailerUrl of the movie is not present or invalid"
        });
    }

    if (!releaseDate) {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The releaseDate of the movie is not present"
        });
    }

    if (!director || typeof director !== 'string') {
        return res.status(STATUS.BAD_REQUEST).json({
            ...badRequestResponse,
            err: "The director of the movie is not present or invalid"
        });
    }

    next();
};

module.exports = {
    validateMovieCreateRequest
};
