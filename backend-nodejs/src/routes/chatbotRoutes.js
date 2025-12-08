const express = require('express');
const { chat } = require('../controllers/chatbotController');

const router = express.Router();

// Public chatbot endpoint
router.post('/', chat);

module.exports = router;
