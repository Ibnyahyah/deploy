const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    products: {
        type: Array
    }
}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);