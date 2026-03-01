const mongoose=require('mongoose');
const { MOVIE_FORMAT } = require('../utils/constants');

const showSchema=new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true,
        index: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
        index: true
    },
    timings: {
        type: String,
        required: true,
        index: true
    },
    noOfSeats: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    format: {
        type: String,
        enum:{
            values : [
                MOVIE_FORMAT.TWO_D,
                MOVIE_FORMAT.THREE_D,
                MOVIE_FORMAT.IMAX,
                MOVIE_FORMAT.FOUR_DX
            ],
            message: "{VALUE} is not a valid movie format"
        },
        default: MOVIE_FORMAT.TWO_D,
    }
},{timestamps: true});

showSchema.index(
    { theatreId: 1, movieId: 1, timings: 1 },
    { unique: true }
);

showSchema.index({ theatreId: 1, timings: 1 });
showSchema.index({ movieId: 1, timings: 1 });

const Show=mongoose.model('Show',showSchema);

module.exports=Show;