const router = require('express').Router();

const { createProducts, getAllProducts, updateProducts, deleteProduct, availabilityOfProduct,products } = require('../controller/products');

router.post('/', (req, res) => createProducts(req, res));
router.get('/', (req, res) => getAllProducts(req, res));
router.get('/products', (req, res) => products(req, res));
router.patch('/:id', (req, res) => updateProducts(req, res));
router.patch('/:id/availability', (req, res) => availabilityOfProduct(req, res));
// router.delete('/:id', (req, res) => deleteProduct(req, res));

module.exports = router;