import express from 'express';
import { searchEvents, getAllEvents, getEventByName, createEvent, getAdminEvents, deleteEvent } from '../controllers/eventController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.get('/search', searchEvents);

router.get('/event', getAllEvents);

router.get('/event/event-details/:event_name', authenticateJWT, getEventByName);

router.post('/event/create', authenticateJWT, createEvent);

router.get('/admin-dashboard', authenticateJWT, getAdminEvents);

router.delete('/events/:event_name', authenticateJWT, deleteEvent);

export default router;