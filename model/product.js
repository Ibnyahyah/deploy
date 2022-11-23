const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    productBrand: {
        type: String,
        require: true
    },
    skuType: {
        type: String,
        require: true
    },
    skuQty: {
        type: String,
        require: true
    },
    price: {
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
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);