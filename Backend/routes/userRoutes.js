const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile/me', authenticateJWT, userController.getMyProfile);
router.put('/profile/me', authenticateJWT, userController.profileChange);
router.get('/profile/:username', userController.profileVisit);

module.exports = router;