const express = require('express');
const router = express.Router();
const { 
    getProfile,
    updateProfile,
    updateVehicleDetails,
    updateAvailabilityStatus
} = require('../../controllers/driver/profile.controller');

router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/vehicle', updateVehicleDetails);
router.put('/availability', updateAvailabilityStatus);

module.exports = router;