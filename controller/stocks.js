const Product = require('../model/product');
// const Stock = require('../model/stock');
const JWT = require('jsonwebtoken')

// create Stock
// const createStock = async (req, res) => {
//     const { stockName, products } = req.body;
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token) return res.status(401).json({ message: 'unauthorized' });
//         const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
//         // const prdcts = await Product.find({ productName: stockName });

//         // const arr = [];

//         // prdcts.find(function (prod) {
//         //     if (new Date(prod.createdAt).getDay() == new Date().getDay()) {
//         //         arr.push(prod);
//         //     }
//         // });
//         // await Stock.create({ stockName, openingStock, closingStock, receipts, sales, damages, physicalCount, variance, products: arr });
//         res.status(200).json({ message: 'Stock created successfully' })
//     } catch (error) {
//         res.status(500).json({ message: 'Something went wrong' });
//         console.log(error);
//     }
// }

const getAllStocks = async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const updateStocks = async (req, res) => {
    const { id } = req.params;
    const { openingStock, closingStock, receipts, sales, damages, physicalCount, variance } = req.body;

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });

        const product = await Product.findByIdAndUpdate(id);
        if (!product) return res.status(404).json({ message: 'Product Not Found' });
        product.openingStock = openingStock;
        product.closingStock = closingStock;
        product.receipts = receipts;
        product.damages = damages;
        product.sales = sales;
        product.physicalCount = physicalCount;
        product.variance = variance;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
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

module.exports = { getAllStocks, updateStocks };