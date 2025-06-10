const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const orderRoutes = require('./order.routes');
const profileRoutes = require('./profile.routes');
const { driverAuthMiddleware } = require('../../middleware/driverAuth');

// Auth routes (public)
router.use('/auth', authRoutes);

// Protected routes
router.use(driverAuthMiddleware);
router.use('/orders', orderRoutes);
router.use('/earnings', require('./earnings.routes'));
router.use('/profile', profileRoutes);

module.exports = router;