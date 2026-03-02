const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLE, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    userRole: {
        type: String,
        enum:Object.values(USER_ROLE),
        default: USER_ROLE.CUSTOMER
    },
    userStatus: {
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.APPROVED
    }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function () {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password
userSchema.methods.isValidPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
