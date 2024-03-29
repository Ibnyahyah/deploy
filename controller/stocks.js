const Product = require('../model/product');
const ProductCopy = require('../model/productCopy');
const Stock = require('../model/stock');
const JWT = require('jsonwebtoken')

// create Stock
const createProductCopy = async (req, res) => {
    const today = new Date().getFullYear() + ':' + new Date().getMonth() + ':' + new Date().getDate();
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role.toLowerCase() == 'admin' || decoded.data.role.toLowerCase() == 'sub-admin' || decoded.data.role.toLowerCase() == 'inventory-admin') {
            const _products = await Product.find();
            const copiedProducts = await ProductCopy.find();

            // copiedProducts.map((prod) => console.log(new Date(prod.createdAt).getMonth() + ':' + new Date(prod.createdAt).getDate(), today))
            const copyChecker = () => {
                return copiedProducts.length > 0 ? copiedProducts.some((prod) => new Date(prod.createdAt).getFullYear() + ':' + new Date(prod.createdAt).getMonth() + ':' + new Date(prod.createdAt).getDate() == today) : _products.some((prod) => new Date(prod.createdAt).getFullYear() + ':' + new Date(prod.createdAt).getMonth() + ':' + new Date(prod.createdAt).getDate() == today);
            }

            if (!copyChecker()) {
                if (copiedProducts.length < 1) {
                    for (let i = 0; i < _products.length; i++) {
                        const product = _products[i];
                        const stock = await Stock.findOne({ productName: product.productName.toLowerCase() });
                        if (product.isAvailable) {
                            if (!stock) {
                                let newStock = []
                                const newProd = await ProductCopy.create({ productID: product._id, productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                                newStock.push(newProd);
                                await Stock.create({ productName: product.productName, products: newStock });
                            } else {
                                const newProd = await ProductCopy.create({ productID: product._id, productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                                stock.products.push(newProd);
                                await stock.save();
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < _products.length; i++) {
                        const product = _products[i];
                        const stock = await Stock.findOne({ productName: product.productName.toLowerCase() });
                        const copiedProduct = await ProductCopy.findOne({ productBrand: product.productBrand });
                        const copied = copiedProducts.find(function (value) {
                            const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
                            const todayDate = new Date().getFullYear() + ':' + new Date().getMonth() + ':' + new Date().getDate()
                            return prodDate === todayDate;
                        });
                        if (product.isAvailable) {
                            if (!copied || !copiedProduct) {
                                if (!stock) {
                                    let newStock = []
                                    const newProd = await ProductCopy.create({ productID: product._id, productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                                    newStock.push(newProd);
                                    await Stock.create({ productName: product.productName, products: newStock });
                                } else {
                                    const newProd = await ProductCopy.create({ productID: product._id, productBrand: product.productBrand, productName: product.productName, availableStock: product.availableStock, skuType: product.skuType, skuQty: product.skuQty, price: product.price })
                                    stock.products.push(newProd);
                                    await stock.save();
                                }
                            }
                        }
                    }
                }
                res.status(200).json({ message: 'Product copied created successfully' })
            } else {
                res.status(403).json({ message: 'Wait for 24hours before copying.' });
            }
        } else {
            return res.status(401).json({ message: 'unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error)
    }
}

const getAllStocks = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role.toLowerCase() == 'admin' || decoded.data.role.toLowerCase() == 'sub-admin' || decoded.data.role.toLowerCase() == 'inventory-admin') {
            const stocks = await Stock.find();
            res.status(200).json(stocks);
        } else {
            return res.status(401).json({ message: 'unauthorized' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getTodayStocks = async (req, res) => {
    const date = new Date()
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.data.role.toLowerCase() == 'admin' || decoded.data.role.toLowerCase() == 'sub-admin' || decoded.data.role.toLowerCase() == 'inventory-admin') {

            const stocks = await Stock.find();
            let todayStocks = [];
            let _stocks = {
                _id: '',
                productName: '',
                products: [],
                date: ''
            };
            let newStocks = [];
            stocks.map(stock => {
                _stocks = {
                    _id: stock._id,
                    productName: stock.productName,
                    products: [],
                    date: stock.updatedAt,
                };
                console.log(stock.products)
                if (stock.products.length > 0) {

                    stock.products.map(prod => {
                        if (new Date(prod.createdAt).getDate() == date.getDate() && new Date(prod.createdAt).getFullYear() == date.getFullYear() && prod !== null) {
                            _stocks.products.push(prod);
                        }
                    })
                }
                todayStocks.push({ ..._stocks });
            })
            res.status(200).json(todayStocks);
        }
        else {
            return res.status(401).json({ message: 'unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error);
    }
}

const updateStocks = async (req, res) => {
    const { id } = req.params;
    const { productBrand, availableStock, openingStock, closingStock, receipts, sales, damages, physicalCount, variance } = req.body;


    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role.toLowerCase() == 'admin' || decoded.data.role.toLowerCase() == 'sub-admin' || decoded.data.role.toLowerCase() == 'inventory-admin') {

            const product = await Product.findByIdAndUpdate(id);
            const copiedProduct = await ProductCopy.findOneAndUpdate({ productID: id });
            const updateStock = await Stock.findOne({ productName: product ? product.productName : copiedProduct.productName });
            const today = new Date().getFullYear() + ':' + new Date().getMonth() + ':' + new Date().getDate();
            const productDate = new Date(product.createdAt).getFullYear() + ':' + new Date(product.createdAt).getMonth() + ':' + new Date(product.createdAt).getDate();

            if (!updateStock) return res.status(404).json({ message: 'Stock Not Found' });
            // if (!product) return res.status(404).json({ message: 'Product Not Found' });
            // if (copiedProduct) {
            //     // copiedProduct.productBrand = productBrand
            //     copiedProduct.availableStock = availableStock;
            //     copiedProduct.openingStock = openingStock;
            //     copiedProduct.closingStock = closingStock;
            //     copiedProduct.receipts = receipts;
            //     copiedProduct.damages = damages;
            //     copiedProduct.sales = sales;
            //     copiedProduct.physicalCount = physicalCount;
            //     copiedProduct.variance = variance;
            // }
            // if (product) {
            //     // product.productBrand = productBrand;
            //     product.availableStock = availableStock;
            //     product.openingStock = openingStock;
            //     product.closingStock = closingStock;
            //     product.receipts = receipts;
            //     product.damages = damages;
            //     product.sales = sales;
            //     product.physicalCount = physicalCount;
            //     product.variance = variance;
            // }

            updateStock.products.forEach(async (prod) => {
                const copiedProductDate = new Date(prod.createdAt).getFullYear() + ':' + new Date(prod.createdAt).getMonth() + ':' + new Date(prod.createdAt).getDate();
                // console.log({ 'some': (prod.productID == id), 'prod': prod._id, prodDate: productDate == today, 'id': id, prod: prod._id == id, productDate, today, copiedProductDate });

                if (prod.productID ? prod.productID == id && copiedProductDate == today : prod._id == id && productDate == today) {
                    // prod.productBrand = productBrand;
                    prod.openingStock = openingStock;
                    prod.availableStock = availableStock;
                    prod.closingStock = closingStock;
                    prod.receipts = receipts;
                    prod.damages = damages;
                    prod.sales = sales;
                    prod.physicalCount = physicalCount;
                    prod.variance = variance;

                    updateStock.products.splice(updateStock.products.indexOf(prod), 1, prod);
                    await updateStock.save();
                }
            });
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            return res.status(401).json({ message: 'unauthorized' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
}

// const deleteStock = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token) return res.status(401).json({ message: 'unauthorized' });
//         const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         if (decoded.data.role != 'admin') return res.status(401).json({ message: 'unauthorized' });
//         const stock = await Stock.findByIdAndDelete(id);
//         if (!stock) return res.status(404).json({ message: 'Stock Not Found' });
//         res.status(200).json({ message: 'Stock deleted successfully' });

//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//         console.log(error);
//     }
// }

module.exports = { createProductCopy, getAllStocks, updateStocks, getTodayStocks };