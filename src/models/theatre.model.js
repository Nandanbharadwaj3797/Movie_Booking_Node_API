const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    movies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Movie'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    }
}, { timestamps: true });

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;