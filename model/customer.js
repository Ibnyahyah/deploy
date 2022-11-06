const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    agentCode: {
        type: String,
    },
    customerEmail: {
        type: String,
    },
    customerFullName: {
        type: String,
    },
    role: {
        type: String,
        enum: ['customer'],
        default: 'customer'
    },
    customerPhone: {
        type: String,
    },
    customerGender: {
        type: String,
    },
    customerStreet: {
        type: String,
    },
    customerNearestLandmark: {
        type: String,
    },
    customerCity: {
        type: String,
    },
    customerOrders: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);