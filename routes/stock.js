const router = require('express').Router();

const { createStock, getAllStocks, updateStocks, deleteStock } = require('../controller/stocks');

router.post('/', (req, res) => createStock(req, res));
router.get('/', (req, res) => getAllStocks(req, res));
router.patch('/:id', (req, res) => updateStocks(req, res));
router.delete('/:id', (req, res) => deleteStock(req, res));

module.exports = router;