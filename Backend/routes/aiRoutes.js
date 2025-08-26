import express from 'express';
import { generateDescription } from '../controllers/aiController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.post('/generate-description', authenticateJWT, generateDescription);

export default router;