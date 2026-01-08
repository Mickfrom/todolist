const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing id and username
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode a JWT token without verifying
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload or null
 */
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
