const mongoose = require('mongoose');

const Routine = new mongoose.Schema({
    description: { type: String, required: true },
    yearly: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    link: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true });

module.exports = mongoose.model('Routine', Routine);