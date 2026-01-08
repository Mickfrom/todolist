const { queryOne, queryAll, run, getLastInsertId } = require('../config/database');

/**
 * Todo Model
 * Handles all database operations related to todos
 */

/**
 * Create a new todo
 * @param {number} userId - User ID who owns the todo
 * @param {string} title - Todo title
 * @param {string} description - Todo description (optional)
 * @param {string} status - Todo status (pending, in_progress, done)
 * @returns {Object} Created todo object
 */
function createTodo(userId, title, description = '', status = 'pending') {
  try {
    const todoId = run(
      'INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description, status]
    );

    console.log('[DEBUG createTodo] Received todoId from run():', todoId, 'Type:', typeof todoId);

    if (todoId === null || todoId === undefined) {
      throw new Error('Failed to create todo: no ID returned');
    }

    return findTodoById(todoId);
  } catch (error) {
    console.error('[ERROR createTodo]:', error);
    throw error;
  }
}

/**
 * Find a todo by ID
 * @param {number} id - Todo ID
 * @returns {Object|null} Todo object or null
 */
function findTodoById(id) {
  console.log('[DEBUG findTodoById] Looking for todo with ID:', id);
  const result = queryOne('SELECT * FROM todos WHERE id = ?', [id]);
  console.log('[DEBUG findTodoById] Result:', result);
  return result;
}

/**
 * Get all todos for a specific user
 * @param {number} userId - User ID
 * @returns {Array} Array of todo objects
 */
function getTodosByUserId(userId) {
  return queryAll(
    'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

/**
 * Update a todo
 * @param {number} id - Todo ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Object} Updated todo object
 */
function updateTodo(id, updates) {
  const { title, description, completed, status } = updates;

  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push('title = ?');
    values.push(title);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (completed !== undefined) {
    fields.push('completed = ?');
    values.push(completed ? 1 : 0);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
    // Auto-sync completed field with status
    if (status === 'done') {
      fields.push('completed = ?');
      values.push(1);
    } else {
      fields.push('completed = ?');
      values.push(0);
    }
  }

  // Always update the updated_at timestamp
  fields.push('updated_at = CURRENT_TIMESTAMP');

  if (fields.length === 0) {
    return findTodoById(id);
  }

  values.push(id);

  run(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return findTodoById(id);
}

/**
 * Toggle todo completed status
 * @param {number} id - Todo ID
 * @returns {Object} Updated todo object
 */
function toggleTodo(id) {
  const todo = findTodoById(id);
  if (!todo) {
    return null;
  }

  const newCompleted = todo.completed === 1 ? 0 : 1;
  const newStatus = newCompleted === 1 ? 'done' : 'pending';

  run(
    'UPDATE todos SET completed = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newCompleted, newStatus, id]
  );

  return findTodoById(id);
}

/**
 * Delete a todo by ID
 * @param {number} id - Todo ID
 */
function deleteTodo(id) {
  run('DELETE FROM todos WHERE id = ?', [id]);
}

/**
 * Delete all todos for a specific user
 * @param {number} userId - User ID
 */
function deleteUserTodos(userId) {
  run('DELETE FROM todos WHERE user_id = ?', [userId]);
}

/**
 * Check if a todo belongs to a specific user
 * @param {number} todoId - Todo ID
 * @param {number} userId - User ID
 * @returns {boolean} True if todo belongs to user
 */
function todosBelongsToUser(todoId, userId) {
  const todo = queryOne(
    'SELECT id FROM todos WHERE id = ? AND user_id = ?',
    [todoId, userId]
  );
  return !!todo;
}

module.exports = {
  createTodo,
  findTodoById,
  getTodosByUserId,
  updateTodo,
  toggleTodo,
  deleteTodo,
  deleteUserTodos,
  todosBelongsToUser
};
