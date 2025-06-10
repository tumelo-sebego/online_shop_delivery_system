const express = require('express');
const router = express.Router();
const { getEarningsSummary } = require('../../controllers/driver/earnings.controller');

router.get('/', getEarningsSummary);

module.exports = router;