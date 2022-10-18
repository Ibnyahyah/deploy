const Order = require('../model/order');
const User = require('../model/user');

const JWT = require('jsonwebtoken')

const createOrder = async (req, res) => {
    const { name, email, phone, product } = req.body;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!token) return res.status(401).json({ message: "unauthorized" });
        const user = await User.findById(decoded.data._id);
        const order = await Order.create({
            name, email, phone, product
        });
        user.orders.push(order);
        await user.save();
        res.status(200).json({ message: 'Success place order' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }

}

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const order = await Order.findById(id);
        if (!order) return res.status(401).json({ message: 'Order Not Found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getOrders = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const setStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const order = await Order.findByIdAndUpdate(id);
        order.status = status;
        await order.save();
        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

module.exports = { createOrder, getOrder, getOrders, setStatus };

