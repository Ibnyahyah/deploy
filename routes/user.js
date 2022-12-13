const express = require('express');
const { getAdmin, getAllAdmins, adminSignIn, updateAdmin, registerAdmin,deleteAdmin } = require('../controller/user');

const router = express.Router();

router.post('/register', (req, res) => registerAdmin(req, res));
router.post('/login', (req, res) => adminSignIn(req, res));
router.patch('/', (req, res) => updateAdmin(req, res));
router.get('/get-all-admins', (req, res) => getAllAdmins(req, res));
router.get('/get-admin/:id', (req, res) => getAdmin(req, res));
router.delete('/delete-admin/:id', (req, res) => deleteAdmin(req, res));


module.exports = router;