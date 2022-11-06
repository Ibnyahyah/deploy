const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        require: true
    },
    customerPhone: {
        type: String,
        require: true
    },
    customerAddress: {
        type: Object,
        require: true
    },
    agentCode: {
        type: String,
        require: true
    },
    agentPhone: {
        type: String,
        require: true
    },
    agentFullName: {
        type: String,
        require: true
    },
    products: {
        type: Array,
        require: true
    },
    orderTotalPrice: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);