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
        enum: ['user', 'admin']
    },
    phone: {
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