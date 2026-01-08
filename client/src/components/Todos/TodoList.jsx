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
      const response = await updateTodo(id, updates);
      if (response.success) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? response.data.todo : todo
          )
        );
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

  const completedCount = Array.isArray(todos) ? todos.filter((todo) => todo.completed).length : 0;
  const totalCount = Array.isArray(todos) ? todos.length : 0;

  console.log('Rendering TodoList - total todos:', totalCount, 'Array:', todos);

  return (
    <div>
      <Header />
      <div className="container">
        <div className="todo-container">
          <h2>My Todos</h2>

          {error && <div className="error-message">{error}</div>}

          <TodoForm onAddTodo={handleAddTodo} />

          <div className="todo-stats">
            <p>
              {completedCount} of {totalCount} completed
            </p>
          </div>

          {loading ? (
            <p className="loading">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="empty-state">No todos yet. Add one above to get started!</p>
          ) : (
            <div className="todo-list">
              {console.log('Rendering todo items, count:', todos.length)}
              {todos.map((todo) => {
                console.log('Rendering todo item:', todo);
                return (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
