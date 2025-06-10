const express = require('express');
const router = express.Router();
const {
    getAllDrivers,
    addDriver
} = require('../../controllers/admin/driver.controller');

router.get('/', getAllDrivers);
router.post('/', addDriver);

module.exports = router;