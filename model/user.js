const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    agentCode: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['sub-admin', 'admin', 'orders-admin', 'agent-admin', 'inventory-admin']
    },
    phone: {
        type: String,
    },
    nearestLandmark: {
        type: String,
    },
    gender: {
        type: String,
    },
    password: {
        type: String
    },
    orders: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);