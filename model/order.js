const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    product: {
        type: String,
    },
    status:{
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

module.exports =mongoose.model("Order", orderSchema);