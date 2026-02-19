const mongoose=require('mongoose');

const showSchema=new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    timings: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    format: {
        type: String
    }
},{timestamps: true});

const Show=mongoose.model('Show',showSchema);

module.exports=Show;