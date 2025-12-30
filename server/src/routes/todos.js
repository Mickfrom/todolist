const express = require('express');
const {
  getAllTodos,
  createNewTodo,
  updateTodoById,
  toggleTodoStatus,
  deleteTodoById
} = require('../controllers/todoController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * Todo Routes
 * Base path: /api/todos
 * All routes are protected (require authentication)
 */

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/todos - Get all todos for current user
router.get('/', getAllTodos);

// POST /api/todos - Create new todo
router.post('/', createNewTodo);

// PUT /api/todos/:id - Update todo
router.put('/:id', updateTodoById);

// PATCH /api/todos/:id/toggle - Toggle todo completed status
router.patch('/:id/toggle', toggleTodoStatus);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', deleteTodoById);

module.exports = router;
