import { useState } from 'react';

/**
 * TodoItem Component
 * Displays a single todo item with edit and delete functionality
 */
export function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  // Guard against invalid todo data
  if (!todo || !todo.id) {
    console.error('Invalid todo data:', todo);
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title || '',
    description: todo.description || '',
    status: todo.status || 'pending'
  });

  const handleToggle = async () => {
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: todo.title,
      description: todo.description || '',
      status: todo.status || 'pending'
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: todo.title,
      description: todo.description || '',
      status: todo.status || 'pending'
    });
  };

  const handleSaveEdit = async () => {
    if (!editData.title.trim()) {
      return;
    }

    try {
      await onUpdate(todo.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = async (newStatus) => {
    console.log('Status change requested:', { todoId: todo.id, oldStatus: todo.status, newStatus });
    try {
      await onUpdate(todo.id, { status: newStatus });
      console.log('Status change completed successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      done: 'Done'
    };
    return labels[status] || 'Pending';
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <input
          type="text"
          name="title"
          value={editData.title}
          onChange={handleChange}
          className="todo-edit-input"
          placeholder="Todo title"
        />
        <input
          type="text"
          name="description"
          value={editData.description}
          onChange={handleChange}
          className="todo-edit-input"
          placeholder="Description"
        />
        <select
          name="status"
          value={editData.status}
          onChange={handleChange}
          className="todo-edit-input"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="todo-actions">
          <button onClick={handleSaveEdit} className="btn btn-success btn-sm">
            Save
          </button>
          <button onClick={handleCancelEdit} className="btn btn-secondary btn-sm">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-text">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && <p className="todo-description">{todo.description}</p>}
        </div>
      </div>
      <div className="todo-meta">
        <div className="status-selector">
          <select
            value={todo.status || 'pending'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={getStatusClass(todo.status || 'pending')}
          >
            <option value="pending">📋 Pending</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="done">✅ Done</option>
          </select>
        </div>
        <div className="todo-actions">
          <button onClick={handleEdit} className="btn btn-sm">
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
