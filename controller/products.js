const Product = require('../model/product');
const JWT = require('jsonwebtoken')

// create products
const createProducts = async (req, res) => {
    const { productName, productBrand, skuType, skuQty, price } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const product = await Product.findOne({ productName });
        if (product) return res.status(400).json({ message: 'Product already exists' });
        await Product.create({ productName, productBrand, skuType, skuQty, price });

        res.status(200).json({ message: 'Product created successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const updateProducts = async (req, res) => {
    const { id } = req.params;
    const { productName, productBrand, skuType, skuQty, price } = req.body;

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });

        const product = await Product.findByIdAndUpdate(id);
        if (!product) return res.status(404).json({ message: 'Product Not Found' });
        product.productName = productName;
        product.productBrand = productBrand;
        product.skuType = skuType;
        product.skuQty = skuQty;
        product.price = price;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product Not Found' });
        res.status(200).json({ message: 'Product deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error);
    }
}

module.exports = { createProducts, getAllProducts, updateProducts, deleteProduct };