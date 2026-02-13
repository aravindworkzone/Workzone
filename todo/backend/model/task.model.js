const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    completed: { type: String,enum: ['Pending', 'Completed'], required: true, default: 'Pending' },
    routine: { type: Boolean, required: true, default: false },
    deleted: { type: Boolean, required: true, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    link: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true });


module.exports = mongoose.model('Task', taskSchema);