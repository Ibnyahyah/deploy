const { signUp, signIn, updateUser } = require('../controller/user');
const { getUserOrders } = require('../controller/order');
const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => signUp(req, res));
router.post('/login', (req, res) => signIn(req, res));
router.patch('/', (req, res) => updateUser(req, res));
router.get('/orders', (req, res) => getUserOrders(req, res));


module.exports = router;