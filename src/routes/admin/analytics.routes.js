const express = require('express');
const router = express.Router();
const {
    getBusinessAnalytics
} = require('../../controllers/admin/analytics.controller');

router.get('/', getBusinessAnalytics);

module.exports = router;