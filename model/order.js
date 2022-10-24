const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    name: {
        type: String, require: true
    },
    email: {
        type: String, require: true
    },
    phone: {
        type: String, require: true
    },
    product: {
        type: String, require: true
    },
    address: {
        type: String, require: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);