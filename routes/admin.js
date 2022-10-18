const router = require('express').Router();

const {getUser, getUsers} = require('../controller/user');


router.get('/user/:id',(req, res)=> getUser(req, res));
router.get('/users',(req, res)=> getUsers(req, res));


module.exports = router;