const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Customer = require('../model/customer');
const Agent = require('../model/agent');

const JWT = require('jsonwebtoken')


const getAnalytics = async (req, res) => {
    const { date } = req.params;
    try {
        const _todayDate = date.split('_')[0];
        const fromDate = date.split('_')[0];
        const toDate = date.split('_')[1];
        const todayDate = new Date(_todayDate).getFullYear() + ':' + new Date(_todayDate).getMonth() + ':' + new Date(_todayDate).getDate();


        console.log({ 'fromDate': fromDate, 'toDate': toDate });
        const _fromDate = new Date(fromDate).getDate() < 10 ? '0' + new Date(fromDate).getDate() : new Date(fromDate).getDate();
        const _toDate = new Date(toDate).getDate() < 10 ? '0' + new Date(toDate).getDate() : new Date(toDate).getDate();

        const _fromMonth = new Date(fromDate).getMonth() < 10 ? '0' + new Date(fromDate).getMonth() : new Date(fromDate).getMonth()
        const _toMonth = new Date(toDate).getMonth() < 10 ? '0' + new Date(toDate).getMonth() : new Date(toDate).getMonth()


        console.log('from date', _fromDate, 'todate', _toDate, 'from month', _fromMonth, 'to month', _toMonth)
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const orders = await Order.find();
        const customers = await Customer.find();

        const ords = [];
        const cutms = [];

        const dateChecker = (a, b, c) => a == todayDate || ((b >= _fromDate && b <= _toDate) && (c >= _fromMonth && c <= _toMonth));

        orders.find(function (value) {
            const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
            const prdDate = new Date(value.createdAt).getDate() < 10 ? '0' + new Date(value.createdAt).getDate() : new Date(value.createdAt).getDate()
            const prdMonth = new Date(value.createdAt).getMonth() < 10 ? '0' + new Date(value.createdAt).getMonth() : new Date(value.createdAt).getMonth()
            console.log(dateChecker(prodDate, prdDate, prdMonth));
            console.log(prodDate, todayDate, prdDate, prdMonth);
            if (dateChecker(prodDate, prdDate, prdMonth)) {
                ords.push(value);
            }
        });
        customers.find(function (value) {
            const customerDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
            const cusDate = new Date(value.createdAt).getDate() < 10 ? '0' + new Date(value.createdAt).getDate() : new Date(value.createdAt).getDate()
            const cusMonth = new Date(value.createdAt).getMonth() < 10 ? '0' + new Date(value.createdAt).getMonth() : new Date(value.createdAt).getMonth()
            console.log(dateChecker(customerDate, cusDate, cusMonth));
            console.log(customerDate, todayDate, cusDate, cusMonth);
            if (dateChecker(customerDate, cusDate, cusMonth)) {
                cutms.push(value);
            }
        });
        let _amountOfSales = '0';
        let _noOfBagSold = '0';
        ords.forEach(function ({ products }) {
            _noOfBagSold = products.length;
            let total = 0;
            products.forEach(function (value) {
                total += Number(value.orderTotalPrice);
            })
            _amountOfSales = total;
        });



        res.status(200).json({ date: date, amountOfSales: _amountOfSales, noOfBagSold: _noOfBagSold, noOfActiveCustomers: '0', noOfRegisteredCustomers: cutms.length, noOfOrders: ords.length });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getAnalytics };