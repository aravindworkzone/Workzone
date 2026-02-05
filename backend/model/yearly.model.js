const mongoose = require('mongoose');

const YearlyGoal = new mongoose.Schema({
    description: { type: String, required: true },
    completed: { type: String,enum: ['Pending', 'Completed'], required: true, default: 'Pending' },
    deleted: { type: Boolean, required: true, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Yearly', YearlyGoal);