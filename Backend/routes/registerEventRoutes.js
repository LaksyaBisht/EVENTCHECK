import express from 'express';
import { registerEvent, getRegistrationsByEvent, getHistory, getTrendingEvents } from '../controllers/registerEventController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import { cacheTrending } from '../middleware/cacheTrending.js';

const router = express.Router();

router.post("/register-event/:event_name", authenticateJWT, registerEvent);

router.get("/registrations/:eventId", authenticateJWT, getRegistrationsByEvent);

router.get("/history", authenticateJWT, getHistory);

router.get('/trending', authenticateJWT, cacheTrending, getTrendingEvents);

export default router;