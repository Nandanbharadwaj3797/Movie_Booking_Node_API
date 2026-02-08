const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLE, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        minLength: 6
    },
    userRole: {
        type: String,
        enum: [USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.client],
        default: USER_ROLE.customer
    },
    userStatus: {
        type: String,
        enum: [USER_STATUS.approved, USER_STATUS.pending, USER_STATUS.rejected],
        default: USER_STATUS.approved
    }
}, { timestamps: true });

// Hash password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.isValidPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
