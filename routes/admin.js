const router = require('express').Router();

const { signIn, createAgent, getAgent, getAgents, getCustomers, getCustomer,getCustomerOrder } = require('../controller/admin');
const { getAgentOrders } = require('../controller/order');

router.post('/sign-in', (req, res) => signIn(req, res));
router.post('/create-agent', (req, res) => createAgent(req, res));
router.get('/agent/:agentCode', (req, res) => getAgent(req, res));
router.get('/agents', (req, res) => getAgents(req, res));
router.get('/customers', (req, res) => getCustomers(req, res));
router.get('/customer/:id', (req, res) => getCustomer(req, res));
router.post('/agent-order', (req, res) => getAgentOrders(req, res));
router.get('/customer-order/:id', (req, res) => getCustomerOrder(req, res));


module.exports = router;