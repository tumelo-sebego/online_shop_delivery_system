const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const driverRoutes = require('./driver.routes');
const customerRoutes = require('./customer.routes');
const analyticsRoutes = require('./analytics.routes');

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/drivers', driverRoutes);
router.use('/customers', customerRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;