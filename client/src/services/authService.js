import api from './api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */

/**
 * Register a new user
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Response with token and user
 */
export async function register(username, email, password) {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password
  });
  return response.data;
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Response with token and user
 */
export async function login(email, password) {
  const response = await api.post('/api/auth/login', {
    email,
    password
  });
  return response.data;
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User object
 */
export async function getCurrentUser() {
  const response = await api.get('/api/auth/me');
  return response.data;
}
