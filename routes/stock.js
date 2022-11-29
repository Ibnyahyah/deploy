const router = require('express').Router();

const { createProductCopy, getTodayStocks, getAllStocks, updateStocks, deleteStock } = require('../controller/stocks');

router.post('/', (req, res) => createProductCopy(req, res));
router.get('/', (req, res) => getAllStocks(req, res));
router.get('/today', (req, res) => getTodayStocks(req, res));
router.patch('/:id', (req, res) => updateStocks(req, res));
// router.delete('/:id', (req, res) => deleteStock(req, res));

module.exports = router;