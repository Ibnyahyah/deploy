const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Customer = require('../model/customer');
const Agent = require('../model/agent');

const JWT = require('jsonwebtoken')
const getAnalytics = async (req, res) => {
    const { date } = req.params;
    const todayDate = new Date(date).getFullYear() + ':' + new Date(date).getMonth() + ':' + new Date(date).getDate()
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const orders = await Order.find();
        const customers = await Customer.find();

        const ords = [];
        const cutms = [];

        orders.find(function (value) {
            const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
            if (prodDate == todayDate) {
                ords.push(value);
            }
        });
        customers.find(function (value) {
            const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate();
            if (prodDate == todayDate) {
                cutms.push(value);
            }
        });
        let _amountOfSales = '';
        let _noOfBagSold = '';
        ords.forEach(function ({ products }) {
            _noOfBagSold = products.length;
            let total = 0;
            products.forEach(function (value) {
                total += Number(value.orderTotalPrice);
            })
            _amountOfSales = total;
        });



        res.status(200).json({ amountOfSales: _amountOfSales, noOfBagSold: _noOfBagSold, noOfActiveCustomers: '0', noOfRegisteredCustomers: cutms.length, noOfOrders: ords.length });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getAnalytics };