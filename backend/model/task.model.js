const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    completed: { type: Boolean, required: true, default: false },
    routine: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
    type: { type: String, enum: ['Today Task','Yearly Goal','Daily Routine'], required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAuth', required: true },
}, { timestamps: true });


module.exports = mongoose.model('Task', taskSchema);