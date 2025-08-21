const express = require('express');
const router = express.Router();
const registerEventController = require('../controllers/registerEventController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post("/register-event/:event_name", authenticateJWT, registerEventController.registerEvent);
router.get("/registrations/:eventId", authenticateJWT, registerEventController.getRegistrationsByEvent);
router.get("/history", authenticateJWT, registerEventController.getHistory);

router.get('/trending', registerEventController.getTrendingEvents);

module.exports = router;