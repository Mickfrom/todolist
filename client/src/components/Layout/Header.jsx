import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

/**
 * Header Component
 * Displays user info and logout button
 */
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>Todo List</h1>
          <nav className="header-nav">
            <Link
              to="/todos"
              className={location.pathname === '/todos' ? 'nav-link active' : 'nav-link'}
            >
              Todos
            </Link>
            <Link
              to="/database"
              className={location.pathname === '/database' ? 'nav-link active' : 'nav-link'}
            >
              Database
            </Link>
          </nav>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
