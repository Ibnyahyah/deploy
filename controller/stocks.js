const Product = require('../model/product');
const ProductCopy = require('../model/productCopy');
const Stock = require('../model/stock');
const JWT = require('jsonwebtoken')

// create Stock
const createProductCopy = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const _products = await Product.find();
        for (let i = 0; i < _products.length; i++) {
            const product = _products[i];
            const stock = await Stock.findOne({ productName: product.productName });
            const copiedProducts = await ProductCopy.find();
            const copied = copiedProducts.some(function (value) {
                const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
                const todayDate = new Date().getFullYear() + ':' + new Date().getMonth() + ':' + new Date().getDate()
                return prodDate == todayDate
            })
            if (copied) return res.status(301).json({ message: 'Can not copy products wait for 24hours.' });
            if (stock) {
                const newProd = await ProductCopy.create({ productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                stock.products.push(newProd, 'newProd');
                await stock.save();
                res.status(200).json({ message: 'Product copied created successfully' })
            } else {
                let newStock = []
                const newProd = await ProductCopy.create({ productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                newStock.push(newProd);
                await Stock.create({ productName: product.productName, products: newStock });
                res.status(200).json({ message: 'Product copied created successfully' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error);
    }
}

const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.status(200).json(stocks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getTodayStocks = async (req, res) => {
    const date = new Date()
    let todayStocks = [];
    try {
        const stocks = await Stock.find();
        stocks.map(stock => {
            stock.products.map(prod => {
                if (new Date(prod.createdAt).getDate() == date.getDate() && new Date(prod.createdAt).getFullYear() == date.getFullYear()) {
                    todayStocks = stocks;
                }
            })
        })
        res.status(200).json(todayStocks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const updateStocks = async (req, res) => {
    const { id } = req.params;
    const { productBrand, availableStock, openingStock, closingStock, receipts, sales, damages, physicalCount, variance } = req.body;

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });

        const product = await Product.findByIdAndUpdate(id);
        const copiedProduct = await ProductCopy.findByIdAndUpdate(id);
        if (!product) return res.status(404).json({ message: 'Product Not Found' });
        product.productBrand = productBrand;
        product.availableStock = availableStock;
        product.openingStock = openingStock;
        product.closingStock = closingStock;
        product.receipts = receipts;
        product.damages = damages;
        product.sales = sales;
        product.physicalCount = physicalCount;
        product.variance = variance;
        copiedProduct.productBrand = productBrand;
        copiedProduct.availableStock = availableStock;
        copiedProduct.openingStock = openingStock;
        copiedProduct.closingStock = closingStock;
        copiedProduct.receipts = receipts;
        copiedProduct.damages = damages;
        copiedProduct.sales = sales;
        copiedProduct.physicalCount = physicalCount;
        copiedProduct.variance = variance;
        const updateStock = await Stock.findOne({ productName: product.productName });
        if (!updateStock) return res.status(404).json({ message: 'Stock Not Found' });

        updateStock.products.forEach(async (prod) => {
            console.log({ 'some': (prod._id == id), 'prod': prod._id, 'id': id });
            if (prod._id == id) {
                prod.productBrand = productBrand;
                prod.openingStock = openingStock;
                prod.availableStock = availableStock;
                prod.closingStock = closingStock;
                prod.receipts = receipts;
                prod.damages = damages;
                prod.sales = sales;
                prod.physicalCount = physicalCount;
                prod.variance = variance;

                await product.save();
                await copiedProduct.save();

                updateStock.products.splice(updateStock.products.indexOf(prod), 1, product);
                await updateStock.save();


                res.status(200).json({ message: 'Product updated successfully' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// const deleteStock = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token) return res.status(401).json({ message: 'unauthorized' });
//         const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
//         const stock = await Stock.findByIdAndDelete(id);
//         if (!stock) return res.status(404).json({ message: 'Stock Not Found' });
//         res.status(200).json({ message: 'Stock deleted successfully' });

//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//         console.log(error);
//     }
// }

module.exports = { createProductCopy, getAllStocks, updateStocks, getTodayStocks };