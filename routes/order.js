const router = require('express').Router();

const { createOrder, getOrder, getOrders, setStatus, getAgent, getCustomer } = require('../controller/order');

router.post('/', (req, res) => createOrder(req, res));
router.get('/:id', (req, res) => getOrder(req, res));
router.get('/', (req, res) => getOrders(req, res));
router.patch('/:id', (req, res) => setStatus(req, res));
router.get('/get-agent/:agentCode', (req, res) => getAgent(req, res));
router.get('/get-customer/:customerPhone', (req, res) => getCustomer(req, res));

module.exports = router;