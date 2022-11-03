const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    agentCode: {
        type: String,
        unique: true
    },
    agentEmail: {
        type: String,
        unique: true
    },
    agentFirstName: {
        type: String,
    },
    agentLastName: {
        type: String,
    },
    role: {
        type: String,
        enum: ['agent'],
        default: 'agent'
    },
    phone: {
        type: String,
        unique: true
    },
    nearestLandmark: {
        type: String,
    },
    gender: {
        type: String,
    },
    orders: {
        type: Array,
        default: [],
    },
    customers: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model("Agent", agentSchema);