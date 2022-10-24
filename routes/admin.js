const router = require('express').Router();

const { getUser, getUsers } = require('../controller/user');
const { signIn } = require('../controller/admin');


router.get('/user/:id', (req, res) => getUser(req, res));
router.get('/users', (req, res) => getUsers(req, res));
router.post('/sign-in', (req, res) => signIn(req, res));


module.exports = router;