import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Private Route Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
}
