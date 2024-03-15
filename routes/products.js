const express = require('express');
const router = express.Router();
const { getProducts, addProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/productController.js');

router.get('/', getProducts);

router.get('/:id', getProduct);

router.post('/', addProduct);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;