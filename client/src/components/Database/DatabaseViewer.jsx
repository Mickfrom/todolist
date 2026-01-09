import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/DatabaseViewer.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function DatabaseViewer() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch list of tables
  useEffect(() => {
    fetchTables();
    fetchStats();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/api/database/tables`);

      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }

      const data = await response.json();
      setTables(data.tables);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/database/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchTableData = async (tableName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/database/tables/${tableName}`);

      if (!response.ok) {
        throw new Error('Failed to fetch table data');
      }

      const data = await response.json();
      setTableData(data);
      setSelectedTable(tableName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTableSchema = (schema) => {
    return (
      <div className="schema-container">
        <h3>Schema</h3>
        <table className="schema-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Type</th>
              <th>Not Null</th>
              <th>Default</th>
              <th>Primary Key</th>
            </tr>
          </thead>
          <tbody>
            {schema.map((col, idx) => (
              <tr key={idx}>
                <td>{col.name}</td>
                <td>{col.type}</td>
                <td>{col.notnull ? 'Yes' : 'No'}</td>
                <td>{col.dflt_value || '-'}</td>
                <td>{col.pk ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableData = (data, schema) => {
    if (!data || data.length === 0) {
      return <p className="no-data">No data in this table</p>;
    }

    const columns = schema.map(col => col.name);

    return (
      <div className="data-container">
        <h3>Data ({data.length} rows)</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col}>
                      {row[col] !== null && row[col] !== undefined
                        ? String(row[col])
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="database-viewer">
      <header className="db-header">
        <div className="db-header-content">
          <h1>Database Viewer</h1>
          <nav className="db-nav">
            <Link to="/login" className="db-nav-link">Login</Link>
            <Link to="/register" className="db-nav-link">Register</Link>
            <Link to="/todos" className="db-nav-link">Todos</Link>
          </nav>
        </div>
      </header>
      <div className="database-content">
        <div className="database-header">
          <h2>todolist.db Contents</h2>
          <p>View all tables and data in the database</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.users}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.todos}</div>
              <div className="stat-label">Total Todos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedTodos}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.pendingTodos}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        )}

        <div className="database-main">
          <div className="tables-sidebar">
            <h2>Tables</h2>
            {error && <p className="error-message">{error}</p>}
            <ul className="tables-list">
              {tables.map(table => (
                <li
                  key={table}
                  className={selectedTable === table ? 'active' : ''}
                  onClick={() => fetchTableData(table)}
                >
                  {table}
                </li>
              ))}
            </ul>
          </div>

          <div className="table-details">
            {loading && <p className="loading">Loading...</p>}

            {!loading && !tableData && (
              <div className="empty-state">
                <p>Select a table to view its contents</p>
              </div>
            )}

            {!loading && tableData && (
              <>
                <h2>{tableData.tableName}</h2>
                {renderTableSchema(tableData.schema)}
                {renderTableData(tableData.data, tableData.schema)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
