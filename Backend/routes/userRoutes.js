import express from 'express';
import { registerUser, loginUser, getMyProfile, profileChange, profileVisit } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile/me', authenticateJWT, getMyProfile);

router.put('/profile/me', authenticateJWT, profileChange);

router.get('/profile/:username', profileVisit);

export default router;