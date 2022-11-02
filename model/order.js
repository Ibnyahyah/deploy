const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        require: true
    },
    agentCode: {
        type: String,
        require: true
    },
    product: {
        type: String,
        require: true
    },
    orderQuantity: {
        type: String,
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