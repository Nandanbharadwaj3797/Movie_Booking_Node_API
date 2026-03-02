const mongoose = require("mongoose");
const { RELEASED_STATUS } = require("../utils/constants");

const movieSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },

    description: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },

    casts: {
        type: [String],
        required: true
    },

    trailerUrl: {
        type: String,
        required: true,
        match: [/^https?:\/\/.+/, "Invalid URL"]
    },

    language: {
        type: String,
        default: "English"
    },

    releaseDate: {
        type: Date,
        required: true
    },

    duration: {
        type: Number,
        required: true,
        min: 1
    },

    director: {
        type: String,
        required: true,
        trim: true
    },

    releaseStatus: {
        type: String,
        enum: Object.values(RELEASED_STATUS),
        default: RELEASED_STATUS.RELEASED
    }

}, { timestamps: true });

movieSchema.index({ name: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ releaseStatus: 1, releaseDate: -1 });

module.exports = mongoose.model("Movie", movieSchema);