const router = require('express').Router();

const { getAnalytics } = require('../controller/analytics');

router.get('/get-analytics/:date', (req, res) => getAnalytics(req, res));

module.exports = router;