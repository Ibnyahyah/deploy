const { signUp, signIn, updateUser, forgotPassword } = require('../controller/user');
const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => signUp(req, res));
router.post('/login', (req, res) => signIn(req, res));
router.patch('/', (req, res) => updateUser(req, res));
router.post('/forgot-password', (req, res) => forgotPassword(req, res));


module.exports = router;