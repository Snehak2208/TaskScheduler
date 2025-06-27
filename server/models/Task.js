const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    estimatedTime: { type: Number, required: true }, // in minutes or hours
    priority: { type: String, default: 'Normal' },
    isFixed: { type: Boolean, default: false }, // for fixed jobs
    fixedStart: { type: String }, // e.g., "09:00"
    fixedEnd: { type: String },   // e.g., "17:00"
    date: { type: String, required: true }, // e.g., "2025-06-25"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
