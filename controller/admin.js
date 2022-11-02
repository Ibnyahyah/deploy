const bcrypt = require('bcryptjs');
const User = require('../model/user');
const Customer = require('../model/customer');
const Agent = require('../model/agent');
const JWT = require('jsonwebtoken');


function generateToken(data) {
    return JWT.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5y",
    });
}


const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(404).json({ message: 'Password incorrect' });
        const token = generateToken(user);
        res.status(200).json({ message: 'Successfully logged in', token: token, user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const createAgent = async (req, res) => {
    const { agentFirstName, agentLastName, agentEmail, phone, nearestLandmark, gender } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    const dates = new Date().getFullYear();
    try {
        if (!token) return res.status(401).json({ message: 'unauthorized' });
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const emailExist = await Agent.findOne({ agentEmail });
        if (emailExist) return res.status(400).json({ message: 'agent already exist with this email' });
        const phoneExist = await Agent.findOne({ phone });
        if (phoneExist) return res.status(400).json({ message: 'agent already exist with this phone' });
        const agentDocs = await Agent.countDocuments();
        const agentCode = "AI" + nearestLandmark.slice(0, 2) + dates.toString().slice(2, 4) + "00" + agentDocs;
        newAgent = await Agent.create({ agentEmail, agentFirstName, agentLastName, phone, agentCode: agentCode.trim().toUpperCase(), nearestLandmark, gender });
        res.status(201).json({ message: 'Agent created successfully', agentCode: newAgent.agentCode });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
}

const getAgent = async (req, res) => {
    const { agentCode } = req.body;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const agent = await Agent.findOne({ agentCode });
        if (!agent) return res.status(404).json({ message: 'Agent Not Found' });
        res.status(200).json(agent);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
}
const getAgents = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const agent = await Agent.find();
        if (!agent) return res.status(404).json({ message: 'Agent Not Found' });
        res.status(200).json(agent);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong', error: e.message });
    }
}

const getCustomers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log(error)
    }
}

const getCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: 'user not found' });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}
const getCustomerOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.data.role !== 'admin') return res.status(401).json({ message: 'unauthorized' });
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: 'user not found' });
        res.status(200).json(customer.customerOrders);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}



module.exports = { signIn, createAgent, getAgent, getAgents, getCustomers, getCustomer, getCustomerOrder };