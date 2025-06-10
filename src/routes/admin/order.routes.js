const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    updateOrderStatus
} = require('../../controllers/admin/order.controller');

router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;