const express = require('express');
const router = express.Router();
const { sendAppointmentNotification } = require('../controllers/emailController');

// POST /api/email/appointment - Send appointment notification
router.post('/appointment', sendAppointmentNotification);

module.exports = router;
