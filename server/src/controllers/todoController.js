const {
  createTodo,
  getTodosByUserId,
  findTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
  todosBelongsToUser
} = require('../models/Todo');

/**
 * Get all todos for current user
 * GET /api/todos
 */
function getAllTodos(req, res) {
  try {
    const userId = req.userId;
    const todos = getTodosByUserId(userId);

    res.json({
      success: true,
      data: { todos }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching todos'
    });
  }
}

/**
 * Create a new todo
 * POST /api/todos
 */
function createNewTodo(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const todo = createTodo(userId, title, description || '');

    console.log('Created todo:', todo);

    res.status(201).json({
      success: true,
      data: { todo }
    });
  } catch (error) {
    console.error('Create todo error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Server error while creating todo',
      details: error.message
    });
  }
}

/**
 * Update a todo
 * PUT /api/todos/:id
 */
function updateTodoById(req, res) {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Prepare updates
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const updatedTodo = updateTodo(id, updates);

    res.json({
      success: true,
      data: { todo: updatedTodo }
    });
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating todo'
    });
  }
}

/**
 * Toggle todo completed status
 * PATCH /api/todos/:id/toggle
 */
function toggleTodoStatus(req, res) {
  try {
    const { id } = req.params;
    const updatedTodo = toggleTodo(id);

    res.json({
      success: true,
      data: { todo: updatedTodo }
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling todo'
    });
  }
}

/**
 * Delete a todo
 * DELETE /api/todos/:id
 */
function deleteTodoById(req, res) {
  try {
    const { id } = req.params;
    deleteTodo(id);

    res.json({
      success: true,
      data: { message: 'Todo deleted successfully' }
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting todo'
    });
  }
}

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodoById,
  toggleTodoStatus,
  deleteTodoById
};
