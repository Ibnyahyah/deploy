const {signUp, signIn, updateUser} = require('../controller/user');
const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => signUp(req, res));
router.post('/login', (req, res) => signIn(req, res));
router.patch('/', (req, res) => updateUser(req, res));


module.exports = router;