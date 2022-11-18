const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stockName: {
        type: String,
        require: true
    },
    openingStock: {
        type: String,
    },
    closingStock: {
        type: String,
    },
    receipts: {
        type: String,
    },
    sales: {
        type: String,
    },
    damages: {
        type: String,
    },
    physicalCount: {
        type: String,
    },
    variance: {
        type: String,
    },
    products: {
        type: Array
    }
}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);