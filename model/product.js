const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        require: true
    },
    productName: {
        type: String,
        require: true
    },
    productBrand: {
        type: String,
        require: true
    },
    availableStock: {
        type: String,
        require: true,
        default: '0',
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
        default: '0',
    },
    closingStock: {
        type: String,
        default: '0',
    },
    receipts: {
        type: String,
        default: '0',
    },
    sales: {
        type: String,
        default: '0',
    },
    damages: {
        type: String,
        default: '0',
    },
    physicalCount: {
        type: String,
        default: '0',
    },
    variance: {
        type: String,
        default: '0',
    },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);