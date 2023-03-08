const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Customer = require('../model/customer');
const Agent = require('../model/agent');

const JWT = require('jsonwebtoken')

const arrProd = [
    {
        title: 'post 11-3-2022',
        date: '11-3-2022',
    },
    {
        title: 'post 12-1-2022',
        date: '12-1-2022',
    },
    {
        title: 'post 12-4-2022',
        date: '12-4-2022',
    },
    {
        title: 'post 12-6-2022',
        date: '12-6-2022',
    },
    {
        title: 'post 11-20-2022',
        date: '11-20-2022',
    },
    {
        title: 'post 11-30-2022',
        date: '11-30-2022',
    },
]

// Define your filtering function
function filterByDate(array, startDate, endDate) {
    // Return a new array that matches the criteria
    return array.filter(product => {
        // Get the date of the product as a number
        let productDate = product.createdAt.getTime();
        // Get the start and end dates as numbers
        let start = startDate.getTime();
        if (endDate == undefined) {
            return productDate == start;
        }
        let end = endDate.getTime();
        // Return true if the product date is between start and end dates
        return productDate >= start && productDate <= end;
    });
}


const getAnalytics = async (req, res) => {
    const { date } = req.params;
    try {
        const _todayDate = date.split('_')[0];
        const fromDate = date.split('_')[0];
        const toDate = date.split('_')[1];
        const todayDate = new Date(_todayDate).getFullYear() + '-' + new Date(_todayDate).getMonth() + '-' + new Date(_todayDate).getDate();


        console.log({ 'fromDate': fromDate, 'toDate': toDate });
        const _fromDate = new Date(fromDate);
        const _toDate = new Date(toDate)

        // const _fromMonth = new Date(fromDate).getMonth() < 10 ? '0' + new Date(fromDate).getMonth() : new Date(fromDate).getMonth()
        // const _toMonth = new Date(toDate).getMonth() < 10 ? '0' + new Date(toDate).getMonth() : new Date(toDate).getMonth()


        // console.log('from date', _fromDate, 'todate', _toDate, 'from month', _fromMonth, 'to month', _toMonth)
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin') {
            const orders = await Order.find();
            const customers = await Customer.find();

            let OrdersArray = [];
            let customersArray = [];

            // console.log(new Date(fromDate).getDay());
            // const dateChecker = (a, b, c) => !toDate ? a == todayDate : (b > _fromDate && b > _toDate ? ((b <= _fromDate || b >= _toDate) && (c >= _fromMonth && c <= _toMonth)) : (((b <= _fromDate && b >= _toDate) || (b >= _fromDate && b <= _toDate)) && (c >= _fromMonth && c <= _toMonth)));
            // const dateChecker = (a, b, c) => !toDate ? a == todayDate : ((b >= _fromDate || b <= _toDate || (b <= _fromDate || b >= _toDate)) && (b >= _fromDate || b <= _toDate)) && (c >= _fromMonth && c <= _toMonth);
            // const dateChecker = (a, b, c) => toDate == undefined ? a == todayDate : ((b >= _fromDate && b >= _toDate) || b <= _toDate ? (((b >= _fromDate || b <= _fromDate) && (b >= _toDate || b >= _toDate)) && (c >= _fromMonth && c <= _toMonth)) : ((b >= _fromDate && b <= _toDate) && (c >= _fromMonth && c <= _toMonth)));
            // const dateChecker = (a, b, c) => toDate == undefined ? a == todayDate : b >= _fromDate && b <= _toDate && c >= _fromMonth && c <= _toMonth;

            // const OrderFilterArray = (arr) => {
            //     const res = arr.filter(myFunction);
            //     function myFunction(value) {
            //         const valueToday = new Date(value.createdAt).getFullYear() + '-' + new Date(value.createdAt).getMonth() + '-' + new Date(value.createdAt).getDate();
            //         return toDate == undefined ? valueToday == todayDate && value.status.toLowerCase() == 'delivered' : (valueDate > _fromDate || valueDate > _toDate ? (valueDate > _fromDate || valueDate > _toDate) : (valueDate >= _fromDate && valueDate <= _toDate)) && (new Date(value.createdAt).getMonth() >= _fromMonth && new Date(value.createdAt).getMonth() <= _toMonth) && value.status.toLowerCase() == 'delivered';
            //     }
            //     return res;
            // }
            // const FilterArray = (arr) => {
            //     const result = arr.filter(myFunction);
            //     function myFunction(value) {
            //         const valueToday = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate();
            //         return toDate == undefined ? valueToday == todayDate : (new Date(value.createdAt).getDate() >= _fromDate && new Date(value.createdAt).getDate() <= _toDate) && (new Date(value.createdAt).getMonth() >= _fromMonth && new Date(value.createdAt).getMonth() <= _toMonth);
            //     }
            //     return result;
            // }

            const orderValue = filterByDate(orders, _fromDate, _toDate);
            OrdersArray = orderValue;
            console.log(orderValue)
            const customerValue = filterByDate(customers, _fromDate, _toDate);
            console.log(customerValue)
            customersArray = customerValue;
            const noOfOrders = filterByDate(orders, _fromDate, _toDate)
            console.log({ noOfOrders })
            // orders.find(function (value) {
            //     const prodDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
            //     const prdDate = new Date(value.createdAt).getDate() < 10 ? '0' + new Date(value.createdAt).getDate() : new Date(value.createdAt).getDate()
            //     const prdMonth = new Date(value.createdAt).getMonth() < 10 ? '0' + new Date(value.createdAt).getMonth() : new Date(value.createdAt).getMonth()
            //     // console.log(dateChecker(prodDate, prdDate, prdMonth));
            //     // console.log({ 'date': prdDate, 'month': prdMonth }, 'orders');
            //     // console.log(value, 'orders');
            //     if (dateChecker(prodDate, prdDate, prdMonth) && value.status.toLowerCase() == 'delivered') {
            //         ords.push(value);
            //         console.log(ords)
            //     }
            // });
            // customers.find(function (value) {
            //     const customerDate = new Date(value.createdAt).getFullYear() + ':' + new Date(value.createdAt).getMonth() + ':' + new Date(value.createdAt).getDate()
            //     const cusDate = new Date(value.createdAt).getDate() < 10 ? '0' + new Date(value.createdAt).getDate() : new Date(value.createdAt).getDate()
            //     const cusMonth = new Date(value.createdAt).getMonth() < 10 ? '0' + new Date(value.createdAt).getMonth() : new Date(value.createdAt).getMonth()
            //     // console.log(dateChecker(customerDate, cusDate, cusMonth));
            //     // console.log({ 'date': cusDate, 'month': cusMonth }, 'customer');
            //     if (dateChecker(customerDate, cusDate, cusMonth)) {
            //         cutms.push(value);
            //     }
            // });
            let _amountOfSales = 0;
            let _noOfBagSold = 0;
            OrdersArray.forEach(function ({ products, orderTotalPrice }) {
                let total = 0;
                products.forEach(function (value) {
                    _noOfBagSold += value.orderQuantity;
                })
                total += Number(orderTotalPrice);
                _amountOfSales += total;
            });


            res.status(200).json({ date: date, amountOfSales: _amountOfSales, noOfBagSold: _noOfBagSold, noOfActiveCustomers: '0', noOfRegisteredCustomers: customersArray.length, noOfOrders: noOfOrders.length });
            // res.status(200).json({ ords: ords });
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getAnalytics };