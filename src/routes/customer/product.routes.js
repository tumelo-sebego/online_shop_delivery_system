const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    searchProducts, 
    getCategories 
} = require('../../controllers/customer/product.controller');

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);

module.exports = router;