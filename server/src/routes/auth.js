const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
