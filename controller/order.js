const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Customer = require('../model/customer');
const Agent = require('../model/agent');

const JWT = require('jsonwebtoken')

// user ends
const createOrder = async (req, res) => {
    const {
        agentCode,
        customerEmail,
        customerFullName,
        customerPhone,
        customerGender,
        customerStreet,
        customerNearestLandmark,
        customerCity,
        products,
        orderTotalPrice,
    } = req.body;
    try {
        let customer;
        const agent = await Agent.findOne({ agentCode });
        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        const customerExist = await Customer.findOne({ customerPhone });
        if (!customerExist) {
            customer = await Customer.create({
                agentCode: agent.agentCode,
                customerEmail,
                customerFullName,
                customerPhone,
                customerGender,
                customerStreet,
                customerNearestLandmark,
                customerCity,
            });
            agent.customers.push(customer);
            await agent.save();
        } else {
            customer = customerExist;
            if (agent.agentCode != customer.agentCode && agent.customers.includes(agent.agentCode !== customer.agentCode)) {
                agent.customers.push(customer);
                await agent.save();
            }
        }

        const order = await Order.create({
            products,
            orderTotalPrice,
            customerId: customer._id,
            customerFullName: customer.customerFullName,
            customerPhone: customer.customerPhone,
            customerAddress: {
                street: customer.customerStreet,
                city: customer.customerCity,
            },
            agentCode: agentCode,
            agentPhone: agent.phone,
            agentFullName: agent.agentFirstName.concat(' ', agent.agentLastName),
        });
        customer.customerOrders.push(order);
        await customer.save();
        agent.orders.push(order);
        await agent.save();
        res.status(200).json({ message: 'Your Order was successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}


//admin ends
const setStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin' || decoded.data.role == 'orders-admin') {
            const order = await Order.findByIdAndUpdate(id);
            order.status = status;
            await order.save();
            res.status(200).json({ message: 'Order Status set to ' + order.status });
        }
        else {
            return res.status(401).json({ message: 'unauthorized' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin' || decoded.data.role == 'orders-admin') {
            const order = await Order.findById(id);
            if (!order) return res.status(401).json({ message: 'Order Not Found' });
            res.status(200).json(order);
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getOrders = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin' || decoded.data.role == 'orders-admin') {
            const orders = await Order.find();
            res.status(200).json(orders);
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const getAgent = async (req, res) => {
    const { agentCode } = req.params;
    try {
        const agent = await Agent.findOne({ agentCode });
        if (!agent) return res.status(404).json({ message: 'Agent Not Found' });
        const { orders, customers, ...agentInfo } = agent._doc;
        res.status(200).json(agentInfo);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
}
const getCustomer = async (req, res) => {
    const { customerPhone } = req.params;
    try {
        const customer = await Customer.findOne({ customerPhone });
        if (!customer) return res.status(404).json({ message: 'Customer Not Found' });
        const { customerOrders, ...customerInfo } = customer._doc;
        res.status(200).json(customerInfo);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
}


const getAgentOrders = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role == 'admin' || decoded.data.role == 'sub-admin' || decoded.data.role == 'orders-admin') {
            const agent = await Agent.findOne(req.body);
            if (!agent)
                return res.status(404).json({ message: "Agent not found" });
            const orders = await Order.find({ agentCode: agent.agentCode });
            res.status(200).json(orders);
        } else { return res.status(401).json({ message: 'unauthorized' }); }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Something went wrong" });
    }
};



module.exports = { createOrder, getOrder, getOrders, setStatus, getAgentOrders, getAgent, getCustomer };

