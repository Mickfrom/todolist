import { useState } from 'react';

/**
 * TodoForm Component
 * Form for adding new todos
 */
export function TodoForm({ onAddTodo }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    setLoading(true);

    try {
      await onAddTodo(formData.title, formData.description);
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          disabled={loading}
          className="todo-input"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          disabled={loading}
          className="todo-input"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading || !formData.title.trim()}>
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  );
}
