const express = require('express');
const router = express.Router();
const { 
    getAvailableOrders,
    acceptOrder,
    updateOrderStatus,
    updateLocation,
    getActiveDeliveries
} = require('../../controllers/driver/order.controller');

router.get('/available', getAvailableOrders);
router.get('/active', getActiveDeliveries);
router.post('/:id/accept', acceptOrder);
router.put('/:id/status', updateOrderStatus);
router.post('/:id/location', updateLocation);

module.exports = router;