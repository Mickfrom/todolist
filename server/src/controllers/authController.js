const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, findUserByUsername, findUserById } = require('../models/User');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already exists
    const existingEmail = findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Check if username already exists
    const existingUsername = findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = createUser(username, email, passwordHash);

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return success response
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
function getCurrentUser(req, res) {
  try {
    // req.user is set by auth middleware
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}

module.exports = {
  register,
  login,
  getCurrentUser
};
