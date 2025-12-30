const { verifyToken } = require('../utils/jwt');
const { findUserById } = require('../models/User');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Attach user to request object (without password)
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

module.exports = { authenticate };
