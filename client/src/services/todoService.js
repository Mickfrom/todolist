import api from './api';

/**
 * Todo Service
 * Handles all todo-related API calls
 */

/**
 * Get all todos for current user
 * @returns {Promise<Array>} Array of todos
 */
export async function getTodos() {
  const response = await api.get('/api/todos');
  return response.data;
}

/**
 * Create a new todo
 * @param {string} title
 * @param {string} description
 * @returns {Promise<Object>} Created todo
 */
export async function createTodo(title, description = '') {
  const response = await api.post('/api/todos', {
    title,
    description
  });
  return response.data;
}

/**
 * Update a todo
 * @param {number} id
 * @param {Object} updates - Fields to update (title, description, completed)
 * @returns {Promise<Object>} Updated todo
 */
export async function updateTodo(id, updates) {
  const response = await api.put(`/api/todos/${id}`, updates);
  return response.data;
}

/**
 * Toggle todo completed status
 * @param {number} id
 * @returns {Promise<Object>} Updated todo
 */
export async function toggleTodo(id) {
  const response = await api.patch(`/api/todos/${id}/toggle`);
  return response.data;
}

/**
 * Delete a todo
 * @param {number} id
 * @returns {Promise<Object>} Success message
 */
export async function deleteTodo(id) {
  const response = await api.delete(`/api/todos/${id}`);
  return response.data;
}
