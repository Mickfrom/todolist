import { useState, useEffect } from 'react';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { Header } from '../Layout/Header';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from '../../services/todoService';

/**
 * TodoList Component
 * Main todo management interface
 */
export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug: Log todos whenever they change
  useEffect(() => {
    console.log('TodoList render - todos state:', todos);
  }, [todos]);

  // Fetch todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await getTodos();
      if (response.success) {
        setTodos(Array.isArray(response.data.todos) ? response.data.todos : []);
      }
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title, description) => {
    try {
      await createTodo(title, description);
      // After creating a todo, reload from the server so the list is always in sync
      await loadTodos();
        setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create todo');
      throw err;
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await toggleTodo(id);
      if (response.success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? response.data.todo : todo
          )
        );
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw err;
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      console.log('handleUpdateTodo called with:', { id, updates });
      const response = await updateTodo(id, updates);
      console.log('Update response:', response);
      if (response.success) {
        console.log('Update successful, reloading todos...');
        // Reload todos from server to ensure sections update correctly
        await loadTodos();
        console.log('Todos reloaded');
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      throw err;
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await deleteTodo(id);
      if (response.success) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw err;
    }
  };

  const totalCount = Array.isArray(todos) ? todos.length : 0;
  const pendingCount = Array.isArray(todos) ? todos.filter((todo) => todo.status === 'pending').length : 0;
  const inProgressCount = Array.isArray(todos) ? todos.filter((todo) => todo.status === 'in_progress').length : 0;
  const doneCount = Array.isArray(todos) ? todos.filter((todo) => todo.status === 'done').length : 0;

  // Separate todos into active and done
  const activeTodos = Array.isArray(todos) ? todos.filter((todo) => todo.status !== 'done') : [];
  const doneTodos = Array.isArray(todos) ? todos.filter((todo) => todo.status === 'done') : [];

  console.log('Rendering TodoList:');
  console.log('  Total:', totalCount);
  console.log('  Active:', activeTodos.length, activeTodos.map(t => ({ id: t.id, title: t.title, status: t.status })));
  console.log('  Done:', doneTodos.length, doneTodos.map(t => ({ id: t.id, title: t.title, status: t.status })));

  return (
    <div>
      <Header />
      <div className="container">
        <div className="todo-container">
          <h2>My Todos</h2>

          {error && <div className="error-message">{error}</div>}

          <TodoForm onAddTodo={handleAddTodo} />

          <div className="todo-stats">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">📋</span>
                <span className="stat-label">Pending:</span>
                <span className="stat-value">{pendingCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">In Progress:</span>
                <span className="stat-value">{inProgressCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <span className="stat-label">Done:</span>
                <span className="stat-value">{doneCount}</span>
              </div>
              <div className="stat-item stat-total">
                <span className="stat-icon">📊</span>
                <span className="stat-label">Total:</span>
                <span className="stat-value">{totalCount}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="loading">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="empty-state">No todos yet. Add one above to get started!</p>
          ) : (
            <>
              {/* Active Todos Section */}
              {activeTodos.length > 0 && (
                <div className="todo-section">
                  <h3 className="section-title">Active Tasks</h3>
                  <div className="todo-list">
                    {activeTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Done Todos Section */}
              {doneTodos.length > 0 && (
                <div className="todo-section done-section">
                  <h3 className="section-title">
                    🏆 Achieved List ({doneTodos.length})
                  </h3>
                  <div className="todo-list">
                    {doneTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
