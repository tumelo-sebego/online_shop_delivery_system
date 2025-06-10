const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrders,
    getOrderDetails
} = require('../../controllers/customer/order.controller');

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderDetails);

module.exports = router;