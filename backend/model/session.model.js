const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    refreshToken: { type: String, required: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    isValid: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);