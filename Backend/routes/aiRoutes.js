const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-description', authenticateJWT, aiController.generateDescription);

module.exports = router;