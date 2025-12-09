const express = require('express');
const router = express.Router();
const { calculateRechargePotential } = require('../controllers/rechargeController');

// GET /api/recharge?latitude=10.93&longitude=76.95
router.get('/', calculateRechargePotential);

module.exports = router;
