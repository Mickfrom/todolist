const { queryOne, queryAll, run, getLastInsertId } = require('../config/database');

/**
 * User Model
 * Handles all database operations related to users
 */

/**
 * Create a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} passwordHash - Hashed password
 * @returns {Object} Created user object
 */
function createUser(username, email, passwordHash) {
  try {
    run(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    const userId = getLastInsertId();
    return findUserById(userId);
  } catch (error) {
    throw error;
  }
}

/**
 * Find a user by ID
 * @param {number} id - User ID
 * @returns {Object|null} User object or null
 */
function findUserById(id) {
  return queryOne('SELECT * FROM users WHERE id = ?', [id]);
}

/**
 * Find a user by email
 * @param {string} email - User's email
 * @returns {Object|null} User object or null
 */
function findUserByEmail(email) {
  return queryOne('SELECT * FROM users WHERE email = ?', [email]);
}

/**
 * Find a user by username
 * @param {string} username - User's username
 * @returns {Object|null} User object or null
 */
function findUserByUsername(username) {
  return queryOne('SELECT * FROM users WHERE username = ?', [username]);
}

/**
 * Get all users (admin function)
 * @returns {Array} Array of user objects
 */
function getAllUsers() {
  return queryAll('SELECT id, username, email, created_at FROM users');
}

/**
 * Delete a user by ID
 * @param {number} id - User ID
 */
function deleteUser(id) {
  run('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  findUserByUsername,
  getAllUsers,
  deleteUser
};
