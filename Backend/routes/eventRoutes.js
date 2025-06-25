const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticateJWT = require('../middleware/authenticateJWT');

// Search events
router.get('/search', eventController.searchEvents);

// Get all events
router.get('/event', eventController.getAllEvents);

// Get event details
router.get('/event/event-details/:event_name', authenticateJWT, eventController.getEventByName);

// Create an event
router.post('/event/create', authenticateJWT, eventController.createEvent);

router.get('/admin-dashboard', authenticateJWT, eventController.getAdminEvents);

router.delete('/events/:event_name', authenticateJWT, eventController.deleteEvent);

module.exports = router;