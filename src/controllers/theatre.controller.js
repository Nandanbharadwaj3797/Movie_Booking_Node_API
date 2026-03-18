const theatreService = require('../services/theatre.service');
const { STATUS } = require('../utils/constants');
const { asyncHandler, sendSuccess } = require('../utils/handlers');
const sendMail = require('../services/email.service');

/**
 * Create Theatre
 */
const create = asyncHandler(async (req, res) => {
    const response = await theatreService.createTheatre({
        ...req.body,
        owner: req.user._id
    });

    sendSuccess(res, STATUS.CREATED, response, "Successfully created the theatre");

    // Fire & forget email
    sendMail(
        req.user.email,
        "Theatre Creation Confirmation",
        `Your theatre named ${response.name} has been successfully created with ID: ${response._id}`
    ).catch(err => {
        console.error("Email sending failed:", err.message);
    });
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

/**
 * Approve/Reject Theatre (Admin only)
 */
const approve = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const theatreId = req.params.id;

    if (!status) {
        return sendSuccess(res, STATUS.BAD_REQUEST, null, "Status is required");
    }

    const response = await theatreService.approveTheatre(theatreId, status);

    // Send email notification to theatre owner
    try {
        const theatre = await theatreService.getTheatreByID(theatreId);
        const owner = await require('../models/user.model').findById(theatre.owner);
        
        const emailSubject = status === 'APPROVED' 
            ? 'Theatre Approval Confirmation' 
            : 'Theatre Rejection Notice';
        
        const emailContent = status === 'APPROVED'
            ? `Congratulations! Your theatre "${theatre.name}" has been approved and is now live on our platform.`
            : `Unfortunately, your theatre "${theatre.name}" has been rejected. Please contact support for more details.`;

        await sendMail(owner.email, emailSubject, emailContent);
    } catch (err) {
        console.error("Email notification failed:", err.message);
    }

    sendSuccess(res, STATUS.OK, response, `Theatre ${status.toLowerCase()} successfully`);
});

module.exports = {
    create,
    destroy,
    getTheatre,
    getTheatres,
    update,
    updateMovies,
    getMovies,
    checkMovie,
    approve
};
